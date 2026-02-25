import { Component, ChangeDetectionStrategy, input, output, linkedSignal, effect } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Unit } from '../../../../shared/model/unit.model';

@Component({
  selector: 'cc-unit-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './unit-details.component.html',
})
export class UnitDetailsComponent {
  unit = input.required<Unit>();
  unitSaved = output<Unit>();

  editMode = linkedSignal(() => !this.unit().id);

  unitForm = new FormGroup({
    code: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    order: new FormControl(100, { nonNullable: true, validators: [Validators.required] }),
    introduction: new FormControl('', { nonNullable: true }),
    goals: new FormControl('', { nonNullable: true }),
    guidelines: new FormControl('', { nonNullable: true }),
  });

  constructor() {
    effect(() => {
      const unit = this.unit();
      this.unitForm.reset();
      this.unitForm.patchValue(unit);
    });
  }

  discardChanges(): void {
    this.unitForm.patchValue(this.unit());
    if (this.unit().id) {
      this.editMode.set(false);
    }
  }

  saveChanges(): void {
    const values = this.unitForm.getRawValue();
    const newUnit: Unit = {
      id: this.unit().id,
      code: values.code,
      name: values.name,
      order: values.order,
      introduction: values.introduction,
      goals: values.goals,
      guidelines: values.guidelines,
    };
    this.editMode.set(false);
    this.unitSaved.emit(newUnit);
  }
}
