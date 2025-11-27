import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/infrastructure/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { CourseSummaryReportComponent } from './course-summary-report/course-summary-report.component';
import { ReflectionsDialogComponent } from './reflections-dialog/reflections-dialog.component';
import { CourseReportDialogComponent } from './course-report-dialog/course-report-dialog.component';

@NgModule({
  declarations: [
    CourseSummaryReportComponent,
    ReflectionsDialogComponent,
    CourseReportDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MarkdownModule.forChild()
  ],
  exports: [
    CourseSummaryReportComponent,
    ReflectionsDialogComponent,
    CourseReportDialogComponent
  ]
})
export class ReportsModule { }
