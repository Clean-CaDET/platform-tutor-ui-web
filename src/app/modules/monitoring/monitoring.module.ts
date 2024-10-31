import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupMonitoringComponent } from './group-monitoring/group-monitoring.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/infrastructure/material.module';
import { GradingComponent } from './grading/grading.component';
import { WeeklyProgressComponent } from './weekly-progress/weekly-progress.component';
import { EnrollmentsComponent } from './enrollments/enrollments.component';
import { TutorMarkdownModule } from "../../shared/markdown/markdown.module";
import { MarkdownModule } from 'ngx-markdown';
import { WeeklyFeedbackComponent } from './weekly-feedback/weekly-feedback.component';
import { CourseMonitoringComponent } from './course-monitoring/course-monitoring.component';

@NgModule({
  declarations: [
    CourseMonitoringComponent,
    GroupMonitoringComponent,
    GradingComponent,
    WeeklyProgressComponent,
    WeeklyFeedbackComponent,
    EnrollmentsComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    MatExpansionModule,
    ReactiveFormsModule,
    MarkdownModule.forChild(),
    TutorMarkdownModule
],
})
export class MonitoringModule {}
