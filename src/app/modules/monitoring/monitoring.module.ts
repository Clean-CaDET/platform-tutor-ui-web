import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupMonitoringComponent } from './group-monitoring/group-monitoring.component';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MaterialModule } from 'src/app/infrastructure/material.module';
import {AssessmentsTableComponent} from './group-monitoring/learner-progress/assessments-table/assessments-table.component';
import {LearnerProgressComponent} from './group-monitoring/learner-progress/learner-progress.component';
import { EnrollmentComponent } from './group-monitoring/enrollment/enrollment.component';

@NgModule({
  declarations: [
    GroupMonitoringComponent,
    AssessmentsTableComponent,
    LearnerProgressComponent,
    EnrollmentComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    NgxChartsModule,
    MatExpansionModule,
  ],
})
export class MonitoringModule {}
