import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, map, startWith } from 'rxjs';
import { Unit } from 'src/app/modules/learning/model/unit.model';

@Component({
  selector: 'cc-task-moving-form',
  templateUrl: './task-moving-form.component.html',
  styleUrls: ['./task-moving-form.component.scss']
})
export class TaskMovingFormComponent implements OnInit {
  formGroup: FormGroup;
  units: Unit[];
  taskName: string;
  filteredUnits: Observable<Unit[]>;

  constructor(private builder: FormBuilder, private dialogRef: MatDialogRef<TaskMovingFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.createForm();
    this.units = this.data.units;
    this.taskName = this.data.taskName;
  }

  private createForm(): void {
    this.formGroup = this.builder.group({
      units: new FormControl('', Validators.required)
    });
    this.filteredUnits = this.formGroup.controls['units'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: any): Unit[] {
    const filterValue = value.toLowerCase();
    return this.units.filter(unit => this.present(unit).toLowerCase().includes(filterValue));
  }

  private present(unit: Unit): string {
    return unit.code + ": " + unit.name;
  }

  onSubmit(): void { 
    this.dialogRef.close(this.findUnitId());
  }

  findUnitId(): number {
    return this.units.find(u => this.present(u) === this.formGroup.controls['units'].value)?.id;
  }

  onClose(): void {
    this.dialogRef.close(false);
  }
}
