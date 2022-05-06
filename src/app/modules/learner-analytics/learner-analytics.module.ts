import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KcmProgressComponent } from './kcm-progress/kcm-progress.component';
import { MaterialModule } from 'src/app/infrastructure/material.module';
import { EventsTableComponent } from './events-table/events-table.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AssessmentsTableComponent } from './assessments-table/assessments-table.component';

@NgModule({
  declarations: [
    EventsTableComponent,
    KcmProgressComponent,
    AssessmentsTableComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    BrowserAnimationsModule
  ]
})
export class LearnerAnalyticsModule { }
