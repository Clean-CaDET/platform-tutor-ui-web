import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupMonitoringComponent } from './group-monitoring/group-monitoring.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/infrastructure/material.module';
import { GradingComponent } from './grading/grading.component';
import { ProgressComponent } from './progress/progress.component';
import { EnrollmentsComponent } from './enrollments/enrollments.component';
import { TutorMarkdownModule } from "../../shared/markdown/markdown.module";
import { MarkdownModule } from 'ngx-markdown';

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
    ReactiveFormsModule,
    MarkdownModule.forChild(),
    TutorMarkdownModule
],
})
export class MonitoringModule {}
