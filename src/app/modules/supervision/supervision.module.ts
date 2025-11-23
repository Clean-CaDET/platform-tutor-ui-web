import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/infrastructure/material.module';
import { MarkdownModule } from 'ngx-markdown';
import { CourseSupervisionComponent } from './course-supervision/course-supervision.component';
import { ReportingComponent } from './reporting/reporting.component';

@NgModule({
  declarations: [
    CourseSupervisionComponent,
    ReportingComponent
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
