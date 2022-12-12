import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LearnersComponent } from './learners/learners.component';
import { MaterialModule } from 'src/app/infrastructure/material.module';
import { GenericsModule } from 'src/app/shared/generics/generics.module';



@NgModule({
  declarations: [
    LearnersComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    GenericsModule
  ]
})
export class StakeholdersModule { }
