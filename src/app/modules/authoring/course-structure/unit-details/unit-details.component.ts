import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Unit } from 'src/app/modules/learning/model/unit.model';

@Component({
  selector: 'cc-unit-details',
  templateUrl: './unit-details.component.html',
  styleUrls: ['./unit-details.component.scss']
})
export class UnitDetailsComponent implements OnChanges {
  @Input() unit: Unit;
  @Output() unitSaved = new EventEmitter<Unit>();
  
  editMode: boolean;
  unitForm: FormGroup;

  constructor(private builder: FormBuilder) { }

  ngOnChanges(): void {
    if(!this.unitForm) this.createForms();

    if(this.unit) {
      this.unitForm.reset();
      this.unitForm.patchValue(this.unit);
      if(!this.unit.id) this.editMode = true;
    }
  }

  private createForms(): void {
    this.unitForm = this.builder.group({
      code: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      order: new FormControl(100, Validators.required),
      introduction: new FormControl(''),
      goals: new FormControl(''),
      guidelines: new FormControl('')
    });
  }

  discardChanges() {
    this.unitForm.patchValue(this.unit);
    if(this.unit.id) this.editMode = false;
  }

  saveChanges() {
    let newUnit: Unit = {
      id: this.unit.id,
      code: this.unitForm.value['code'],
      name: this.unitForm.value['name'],
      order: this.unitForm.value['order'],
      introduction: this.unitForm.value['introduction'],
      goals: this.unitForm.value['goals'],
      guidelines: this.unitForm.value['guidelines'],
    };
    if(this.unit.id) newUnit.id = this.unit.id;

    this.editMode = false;

    this.unitSaved.emit(newUnit);
  }
}
