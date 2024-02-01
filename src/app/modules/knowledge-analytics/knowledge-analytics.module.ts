import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KcStatisticsComponent } from './kc-statistics/kc-statistics.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MaterialModule } from 'src/app/infrastructure/material.module';
import { UnitAnalyticsComponent } from './unit-analytics/unit-analytics.component';
import { AiStatisticsComponent } from './ai-statistics/ai-statistics.component';
import { RouterModule } from '@angular/router';
import { SubmissionStatisticsComponent } from './submission-statistics/submission-statistics.component';

@NgModule({
  declarations: [
    KcStatisticsComponent,
    UnitAnalyticsComponent,
    AiStatisticsComponent,
    SubmissionStatisticsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    NgxChartsModule,
    RouterModule
  ]
})
export class KnowledgeAnalyticsModule {}
