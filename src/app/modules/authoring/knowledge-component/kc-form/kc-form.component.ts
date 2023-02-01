import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { KnowledgeComponent } from 'src/app/modules/learning/model/knowledge-component.model';

export enum FormMode {
  AddFirst,
  EditFirst,
  AddChild,
  EditChild
}

@Component({
  selector: 'cc-kc-form',
  templateUrl: './kc-form.component.html',
  styleUrls: ['./kc-form.component.scss']
})
export class KcFormComponent {
  formGroup: FormGroup;
  knowledgeComponent: KnowledgeComponent;
  parentOptions: KnowledgeComponent[];
  mode: FormMode;
  FormMode = FormMode;

  filteredOptions: Observable<KnowledgeComponent[]>;

  constructor(private builder: FormBuilder, private dialogRef: MatDialogRef<KcFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
      this.knowledgeComponent = data.knowledgeComponent;
      this.parentOptions = data.parentComponentOptions;
      this.mode = data.formMode;

      this.createForm();
      if(this.knowledgeComponent) {
        this.formGroup.patchValue(this.knowledgeComponent);
        this.formGroup.patchValue({parentComponent: this.findParent(this.knowledgeComponent.parentId)});
      }
      this.filteredOptions = this.formGroup.controls['parentComponent'].valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || '')),
      );
  }

  findParent(id: number): string {
    if(this.parentOptions.length === 0) return null;
    return this.presentParent(this.parentOptions.find(p => p.id === id));
  }

  private createForm(): void {
    this.formGroup = this.builder.group({
      code: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      order: new FormControl(100, Validators.required),
      expectedDurationInMinutes: new FormControl(10, Validators.required),
      parentComponent: new FormControl('', this.requireIfChildComponent())
    });
  }

  requireIfChildComponent() {
    return this.mode === FormMode.AddChild || this.mode === FormMode.EditChild ? Validators.required : null;
  }

  private _filter(value: any): KnowledgeComponent[] {
    const filterValue = value.toLowerCase();
    return this.parentOptions.filter(option => this.presentParent(option).toLowerCase().includes(filterValue));
  }

  private presentParent(option: KnowledgeComponent): string {
    return option.code + ": " + option.name;
  }

  noItemSelected() {
    return (this.mode == FormMode.AddChild || this.mode == FormMode.EditChild) && !this.findSelectedParent();
  }

  onSubmit(): void {
    let newKc: KnowledgeComponent = {
      id: this.knowledgeComponent.id,
      code: this.formGroup.controls['code'].value,
      name: this.formGroup.controls['name'].value,
      description: this.knowledgeComponent.description,
      expectedDurationInMinutes: this.formGroup.controls['expectedDurationInMinutes'].value,
      order: this.formGroup.controls['order'].value,
      parentId: this.findSelectedParent()?.id,
      knowledgeUnitId: this.knowledgeComponent.knowledgeUnitId
    }

    this.dialogRef.close(newKc);
  }

  onReset(): void {
    this.formGroup.reset();
    if(this.knowledgeComponent?.id) {
      this.formGroup.patchValue(this.knowledgeComponent);
      this.formGroup.patchValue({parentComponent: this.findParent(this.knowledgeComponent.parentId)});
    }
  }

  onClose(): void {
    this.dialogRef.close(false);
  }

  private findSelectedParent() {
    return this.parentOptions.find(o => this.presentParent(o) === this.formGroup.controls['parentComponent'].value)
  }
}
