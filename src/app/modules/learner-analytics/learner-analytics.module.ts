import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KcmProgressComponent } from './kcm-progress/kcm-progress.component';
import { MaterialModule } from 'src/app/infrastructure/material.module';
import { EventsTableComponent } from './events-table/events-table.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AssessmentsTableComponent } from './assessments-table/assessments-table.component';
import { FormsModule } from '@angular/forms';
import { KcStatisticsComponent } from './kc-statistics/kc-statistics.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {MatExpansionModule} from '@angular/material/expansion';

@NgModule({
  declarations: [
    EventsTableComponent,
    KcmProgressComponent,
    AssessmentsTableComponent,
    KcStatisticsComponent
  ],
    imports: [
        CommonModule,
        MaterialModule,
        BrowserAnimationsModule,
        FormsModule,
        NgxChartsModule,
        MatExpansionModule
    ]
})
export class LearnerAnalyticsModule { }
