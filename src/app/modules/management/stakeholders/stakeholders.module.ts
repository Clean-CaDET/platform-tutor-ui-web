import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StakeholdersComponent } from './stakeholders/stakeholders.component';
import { MaterialModule } from 'src/app/infrastructure/material.module';
import { GenericsModule } from 'src/app/shared/generics/generics.module';



@NgModule({
  declarations: [
    StakeholdersComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    GenericsModule
  ]
})
export class StakeholdersModule { }
