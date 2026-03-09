import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { FieldOption } from '../../../../shared/generics/model/field-option';
import { LearnersService } from '../learners.service';
import { CreateLearner } from '../../model/create-learner.model';

@Component({
  selector: 'cc-bulk-add',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule, MatDialogTitle, MatDialogContent, MatDialogActions,
    MatTableModule, MatFormFieldModule, MatInputModule, MatRadioModule, MatButtonModule,
  ],
  templateUrl: './bulk-add.component.html',
})
export class BulkAddComponent {
  private readonly dialogRef = inject(MatDialogRef<BulkAddComponent>);
  private readonly learnerService = inject(LearnersService);

  readonly formGroup = new FormGroup({
    learnersType: new FormControl('', Validators.required),
    learners: new FormControl('', Validators.required),
  });

  readonly learnerTypes: FieldOption[] = [
    { label: 'FTN', value: 'Regular' },
    { label: 'FTN Inf', value: 'Commercial' },
  ];

  readonly checkView = signal(false);
  readonly invalidEntries = signal<string[]>([]);
  readonly existingDatasource = signal<MatTableDataSource<CreateLearner> | null>(null);
  readonly dataSource = signal<MatTableDataSource<CreateLearner> | null>(null);
  readonly displayedColumns = ['num', 'username', 'name', 'surname', 'email'];

  private learners: CreateLearner[] = [];
  private newLearners: CreateLearner[] = [];

  onCheck(): void {
    this.createLearnerList();
    this.checkView.set(true);

    this.learnerService.getLearners(this.learners.map(l => l.index)).subscribe(data => {
      if (data.totalCount === 0) {
        this.newLearners = this.learners;
        this.dataSource.set(new MatTableDataSource(this.newLearners));
        return;
      }

      const existingUsernames = data.results.map(a => a.index);
      const existingLearners: CreateLearner[] = [];
      this.newLearners = [];
      this.learners.forEach(learner => {
        if (existingUsernames.includes(learner.index))
          existingLearners.push(learner);
        else
          this.newLearners.push(learner);
      });
      this.existingDatasource.set(new MatTableDataSource(existingLearners));
      this.dataSource.set(new MatTableDataSource(this.newLearners));
    });
  }

  private createLearnerList(): void {
    const learnerEntries: string[] = this.formGroup.value.learners!.split('\n');
    const invalidEntries: string[] = [];
    this.learners = [];

    for (let i = 0; i < learnerEntries.length; i++) {
      if (learnerEntries[i].trim() === '') continue;

      const elements = learnerEntries[i].split(',');
      if (elements.length !== 5) {
        invalidEntries.push(learnerEntries[i]);
        continue;
      }

      if (this.learners.findIndex(l => l.index === elements[0].trim()) !== -1) continue;
      this.learners.push(this.createLearner(i, elements));
    }
    this.invalidEntries.set(invalidEntries);
  }

  private createLearner(i: number, elements: string[]): CreateLearner {
    return {
      num: i + 1,
      index: elements[0].trim(),
      password: elements[1].trim(),
      name: elements[2].trim(),
      surname: elements[3].trim(),
      email: elements[4].trim(),
      learnerType: this.formGroup.controls.learnersType.value!,
    };
  }

  onBack(): void {
    this.checkView.set(false);
  }

  onSubmit(): void {
    this.dialogRef.close(this.newLearners.length ? this.newLearners : null);
  }

  onClose(): void {
    this.dialogRef.close(false);
  }

  getErrorMessage(controlName: string): string {
    if (this.formGroup.get(controlName)?.hasError('required')) {
      return 'Obavezno odaberi.';
    }
    return '';
  }
}
