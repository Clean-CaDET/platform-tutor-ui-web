import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericTableComponent } from './generic-table/generic-table.component';
import { MaterialModule } from 'src/app/infrastructure/material.module';
import { GenericFormComponent } from './generic-form/generic-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DeleteFormComponent } from './delete-form/delete-form.component';
import { PlainGenericTableComponent } from './plain-generic-table/plain-generic-table.component';
import { GenericSelectionFormComponent } from './generic-selection-form/generic-selection-form.component';

@NgModule({
  declarations: [GenericTableComponent, GenericFormComponent, DeleteFormComponent, PlainGenericTableComponent, GenericSelectionFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [GenericTableComponent, GenericFormComponent, PlainGenericTableComponent, GenericSelectionFormComponent]
})
export class GenericsModule { }
