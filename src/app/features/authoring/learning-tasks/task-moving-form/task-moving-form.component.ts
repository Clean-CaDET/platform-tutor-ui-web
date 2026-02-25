import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs';
import { Unit } from '../../model/unit.model';

@Component({
  selector: 'cc-task-moving-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatAutocompleteModule, MatButtonModule,
  ],
  template: `
    <mat-dialog-content>
      <p>Premesti <b>{{ taskName }}</b></p>
      <mat-form-field style="width: 100%;">
        <mat-label>Lekcija</mat-label>
        <input matInput [formControl]="unitControl" [matAutocomplete]="auto">
        <mat-autocomplete #auto="matAutocomplete">
          @for (unit of filteredUnits(); track unit.id) {
            <mat-option [value]="present(unit)">{{ present(unit) }}</mat-option>
          }
        </mat-autocomplete>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="start">
      <button matButton="filled" [disabled]="!unitControl.valid || !findUnitId()" (click)="onSubmit()">
        Premesti
      </button>
      <button matButton (click)="onClose()">Zatvori</button>
    </mat-dialog-actions>
  `,
})
export class TaskMovingFormComponent {
  private readonly dialogRef = inject(MatDialogRef<TaskMovingFormComponent>);
  private readonly data = inject<{ units: Unit[]; taskName: string }>(MAT_DIALOG_DATA);

  readonly units = this.data.units;
  readonly taskName = this.data.taskName;
  readonly unitControl = new FormControl('', { nonNullable: true, validators: [Validators.required] });

  readonly filteredUnits = toSignal(
    this.unitControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const filter = (value ?? '').toLowerCase();
        return this.units.filter(u => this.present(u).toLowerCase().includes(filter));
      }),
    ),
    { initialValue: this.units },
  );

  present(unit: Unit): string {
    return unit.code + ': ' + unit.name;
  }

  findUnitId(): number | undefined {
    return this.units.find(u => this.present(u) === this.unitControl.value)?.id;
  }

  onSubmit(): void {
    this.dialogRef.close(this.findUnitId());
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
