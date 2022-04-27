import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsInstructorComponent } from './analytics-instructor.component';
import { MaterialModule } from 'src/app/infrastructure/material.module';

@NgModule({
  declarations: [
    AnalyticsInstructorComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class AnalyticsInstructorModule { }
