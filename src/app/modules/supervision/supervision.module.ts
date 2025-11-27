import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/infrastructure/material.module';
import { MarkdownModule } from 'ngx-markdown';
import { ActiveSupervisionComponent } from './active-supervision/active-supervision.component';
import { ReportingComponent } from './reporting/reporting.component';
import { ReportsModule } from 'src/app/shared/reports/reports.module';

@NgModule({
  declarations: [
    ActiveSupervisionComponent,
    ReportingComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MarkdownModule.forChild(),
    ReportsModule
  ]
})
export class SupervisionModule {}
