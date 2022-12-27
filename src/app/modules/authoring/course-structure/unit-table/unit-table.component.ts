import { Component, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Unit } from 'src/app/modules/learning/model/unit.model';

@Component({
  selector: 'cc-unit-table',
  templateUrl: './unit-table.component.html',
  styleUrls: ['./unit-table.component.scss']
})
export class UnitTableComponent implements OnChanges {
  @Input() unit: Unit;
  editMode: boolean;
  unitForm: FormGroup;

  constructor(private builder: FormBuilder) { }

  ngOnChanges(): void {
    if(!this.unitForm) this.createForms();
    if(this.unit) this.unitForm.patchValue(this.unit);
  }

  private createForms(): void {
    this.unitForm = this.builder.group({
      code: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      description: new FormControl('')
    });
  }

  discardChanges() {
    this.unitForm.patchValue(this.unit);
    this.editMode = false;
  }

  saveChanges() {
    let newUnit: Unit = {
      code: this.unitForm.value['code'],
      name: this.unitForm.value['name'],
      description: this.unitForm.value['description'],
    };

    this.editMode = false;

    console.log(newUnit); //TODO
  }

}
