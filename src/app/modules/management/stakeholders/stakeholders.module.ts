import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StakeholdersComponent } from './stakeholders/stakeholders.component';
import { MaterialModule } from 'src/app/infrastructure/material.module';



@NgModule({
  declarations: [
    StakeholdersComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class StakeholdersModule { }
