import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/infrastructure/material.module';
import { MarkdownModule } from 'ngx-markdown';
import { CourseSupervisionComponent } from './course-supervision/course-supervision.component';
import { ReportingComponent } from './reporting/reporting.component';
import { CourseSummaryReportComponent } from './reporting/course-summary-report/course-summary-report.component';
import { ReflectionsDialogComponent } from './reporting/course-summary-report/reflections-dialog/reflections-dialog.component';

@NgModule({
  declarations: [
    CourseSupervisionComponent,
    ReportingComponent,
    CourseSummaryReportComponent,
    ReflectionsDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MarkdownModule.forChild()
],
})
export class SupervisionModule {}
