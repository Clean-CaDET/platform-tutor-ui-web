import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KcmProgressComponent } from './kcm-progress/kcm-progress.component';
import { MaterialModule } from 'src/app/infrastructure/material.module';
import { EventsTableComponent } from './events-table/events-table.component';

@NgModule({
  declarations: [
    EventsTableComponent,
    KcmProgressComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class LearnerAnalyticsModule { }
