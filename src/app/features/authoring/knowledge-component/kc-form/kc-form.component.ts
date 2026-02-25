import { Component, ChangeDetectionStrategy, inject, Signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, startWith } from 'rxjs';
import { KnowledgeComponent } from '../../../../shared/model/knowledge-component.model';

export enum FormMode {
  AddFirst,
  EditFirst,
  AddChild,
  EditChild,
}

export interface KcFormDialogData {
  knowledgeComponent: KnowledgeComponent;
  parentComponentOptions: KnowledgeComponent[];
  allKcs: KnowledgeComponent[];
  formMode: FormMode;
}

@Component({
  selector: 'cc-kc-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatAutocompleteModule,
  ],
  templateUrl: './kc-form.component.html',
})
export class KcFormComponent {
  private readonly dialogRef = inject(MatDialogRef<KcFormComponent>);
  private readonly data: KcFormDialogData = inject(MAT_DIALOG_DATA);

  readonly knowledgeComponent = this.data.knowledgeComponent;
  readonly parentOptions = this.data.parentComponentOptions;
  readonly allKcs = this.data.allKcs;
  readonly mode = this.data.formMode;
  readonly FormMode = FormMode;

  readonly formGroup = new FormGroup({
    code: new FormControl('', { validators: [Validators.required, this.uniqueCode()], nonNullable: true }),
    name: new FormControl('', { validators: Validators.required, nonNullable: true }),
    order: new FormControl(100, { validators: Validators.required, nonNullable: true }),
    expectedDurationInMinutes: new FormControl(10, { validators: Validators.required, nonNullable: true }),
    parentComponent: new FormControl('', {
      validators: this.isChildMode() ? Validators.required : null,
      nonNullable: true,
    }),
  });

  readonly filteredOptions: Signal<KnowledgeComponent[]>;

  constructor() {
    if (this.knowledgeComponent) {
      this.formGroup.patchValue({
        code: this.knowledgeComponent.code ?? '',
        name: this.knowledgeComponent.name ?? '',
        order: this.knowledgeComponent.order ?? 100,
        expectedDurationInMinutes: this.knowledgeComponent.expectedDurationInMinutes ?? 10,
        parentComponent: this.findParent(this.knowledgeComponent.parentId) ?? '',
      });
    }

    this.filteredOptions = toSignal(
      this.formGroup.controls.parentComponent.valueChanges.pipe(
        startWith(''),
        map(value => this.filterOptions(value ?? '')),
      ),
      { initialValue: this.parentOptions },
    );
  }

  presentParent(option: KnowledgeComponent): string {
    return option.code + ': ' + option.name;
  }

  noItemSelected(): boolean {
    return this.isChildMode() && !this.findSelectedParent();
  }

  onSubmit(): void {
    const newKc: KnowledgeComponent = {
      id: this.knowledgeComponent.id,
      code: this.formGroup.controls.code.value,
      name: this.formGroup.controls.name.value,
      description: this.knowledgeComponent.description ?? '',
      expectedDurationInMinutes: this.formGroup.controls.expectedDurationInMinutes.value,
      order: this.formGroup.controls.order.value,
      parentId: this.findSelectedParent()?.id ?? this.knowledgeComponent.parentId,
      knowledgeUnitId: this.knowledgeComponent.knowledgeUnitId,
    };
    this.dialogRef.close(newKc);
  }

  onReset(): void {
    this.formGroup.reset();
    if (this.knowledgeComponent?.id) {
      this.formGroup.patchValue({
        code: this.knowledgeComponent.code,
        name: this.knowledgeComponent.name,
        order: this.knowledgeComponent.order,
        expectedDurationInMinutes: this.knowledgeComponent.expectedDurationInMinutes,
        parentComponent: this.findParent(this.knowledgeComponent.parentId) ?? '',
      });
    }
  }

  onClose(): void {
    this.dialogRef.close(false);
  }

  private isChildMode(): boolean {
    return this.mode === FormMode.AddChild || this.mode === FormMode.EditChild;
  }

  private findParent(id: number | undefined): string | null {
    if (!this.parentOptions.length || id == null) return null;
    const parent = this.parentOptions.find(p => p.id === id);
    return parent ? this.presentParent(parent) : null;
  }

  private findSelectedParent(): KnowledgeComponent | undefined {
    return this.parentOptions.find(o =>
      this.presentParent(o) === this.formGroup.controls.parentComponent.value
    );
  }

  private filterOptions(value: string): KnowledgeComponent[] {
    const filterValue = (value ?? '').toLowerCase();
    return this.parentOptions.filter(option =>
      this.presentParent(option).toLowerCase().includes(filterValue)
    );
  }

  private uniqueCode(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      for (const kc of this.allKcs) {
        if (kc.code === control.value && kc.id !== this.knowledgeComponent.id) {
          return { notUnique: true };
        }
      }
      return null;
    };
  }
}
