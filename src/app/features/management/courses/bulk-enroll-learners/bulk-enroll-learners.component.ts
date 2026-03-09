import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LearnersService } from '../../learners/learners.service';
import { StakeholderAccount } from '../../model/stakeholder-account.model';

@Component({
  selector: 'cc-bulk-enroll-learners',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule, MatDialogTitle, MatDialogContent, MatDialogActions,
    MatTableModule, MatFormFieldModule, MatInputModule, MatButtonModule,
  ],
  templateUrl: './bulk-enroll-learners.component.html',
})
export class BulkEnrollLearnersComponent {
  private readonly dialogRef = inject(MatDialogRef<BulkEnrollLearnersComponent>);
  private readonly learnerService = inject(LearnersService);

  readonly formGroup = new FormGroup({
    learners: new FormControl('', Validators.required),
  });

  readonly checkView = signal(false);
  readonly missingEntries = signal<string[]>([]);
  readonly dataSource = signal<MatTableDataSource<StakeholderAccount> | null>(null);
  readonly displayedColumns = ['num', 'username', 'name', 'surname', 'email'];

  private learners: StakeholderAccount[] = [];

  onCheck(): void {
    const allEntries = this.getNonEmptyRows();

    this.learnerService.getLearners(allEntries).subscribe(response => {
      this.learners = response.results;
      this.missingEntries.set(this.determineMissingEntries(allEntries));
      this.dataSource.set(new MatTableDataSource(this.learners));
      this.checkView.set(true);
    });
  }

  private determineMissingEntries(allEntries: string[]): string[] {
    return allEntries.filter(e => !this.learners.map(l => l.index).includes(e));
  }

  private getNonEmptyRows(): string[] {
    return this.formGroup.value.learners!.split('\n').filter((e: string) => e.trim());
  }

  onBack(): void {
    this.checkView.set(false);
  }

  onSubmit(): void {
    this.dialogRef.close(this.learners);
  }

  onClose(): void {
    this.dialogRef.close(false);
  }
}
