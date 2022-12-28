import { Component, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Unit } from 'src/app/modules/learning/model/unit.model';

@Component({
  selector: 'cc-unit-details',
  templateUrl: './unit-details.component.html',
  styleUrls: ['./unit-details.component.scss']
})
export class UnitDetailsComponent implements OnChanges {
  @Input() unit: Unit;
  unitDescription: string;
  
  editMode: boolean;
  unitForm: FormGroup;

  constructor(private builder: FormBuilder) { }

  ngOnChanges(): void {
    if(!this.unitForm) this.createForms();

    if(this.unit) {
      this.unitForm.reset();
      this.unitForm.patchValue(this.unit);
      this.unitDescription = this.unit.description;
      if(!this.unit.id) this.editMode = true;
    }
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
    this.unitDescription = this.unit.description;
    if(this.unit.id) this.editMode = false;
  }

  saveChanges() {
    let newUnit: Unit = {
      code: this.unitForm.value['code'],
      name: this.unitForm.value['name'],
      description: this.unitDescription,
    };
    if(this.unit.id) newUnit.id = this.unit.id;

    this.editMode = false;

    console.log(newUnit); //TODO
    console.log(this.unit); //TODO
  }

  updateDescription(text: string): void {
    this.unitDescription = text;
  }

}
