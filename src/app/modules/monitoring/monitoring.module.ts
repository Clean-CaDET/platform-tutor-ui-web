import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupMonitoringComponent } from './group-monitoring/group-monitoring.component';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/infrastructure/material.module';
import { GradingComponent } from './grading/grading.component';
import { ProgressComponent } from './progress/progress.component';
import { EnrollmentsComponent } from './enrollments/enrollments.component';

@NgModule({
  declarations: [
    GroupMonitoringComponent,
    GradingComponent,
    ProgressComponent,
    EnrollmentsComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    MatExpansionModule,
  ],
})
export class MonitoringModule {}
