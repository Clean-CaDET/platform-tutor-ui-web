import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericTableComponent } from './generic-table/generic-table.component';
import { MaterialModule } from 'src/app/infrastructure/material.module';
import { GenericFormComponent } from './generic-form/generic-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeleteFormComponent } from './delete-form/delete-form.component';
import { GenericSelectionFormComponent } from './generic-selection-form/generic-selection-form.component';
import { FieldOptionsPipe } from './generic-table/field-option.pipe';
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
  declarations: [GenericTableComponent, GenericFormComponent, DeleteFormComponent, GenericSelectionFormComponent, FieldOptionsPipe],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MarkdownModule.forChild()
  ],
  exports: [GenericTableComponent, GenericFormComponent, GenericSelectionFormComponent]
})
export class GenericsModule { }
