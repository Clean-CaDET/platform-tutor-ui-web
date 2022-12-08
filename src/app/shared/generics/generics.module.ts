import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericTableComponent } from './generic-table/generic-table.component';
import { MaterialModule } from 'src/app/infrastructure/material.module';



@NgModule({
  declarations: [GenericTableComponent],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [GenericTableComponent]
})
export class GenericsModule { }
