import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CourseReport } from '../course-report.model';
import { CourseSummaryReportComponent } from '../course-summary-report/course-summary-report.component';

interface DialogData {
  reports: CourseReport[];
  currentIndex: number;
}

@Component({
  selector: 'cc-course-report-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, MatButtonModule, MatTooltipModule, CourseSummaryReportComponent],
  templateUrl: './course-report-dialog.component.html',
  styleUrl: './course-report-dialog.component.scss',
})
export class CourseReportDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<CourseReportDialogComponent>);
  private readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  reports: CourseReport[];
  currentIndex: number;

  constructor() {
    this.reports = this.data.reports;
    this.currentIndex = this.data.currentIndex;
  }

  get currentReport(): CourseReport {
    return this.reports[this.currentIndex];
  }

  get hasMultipleReports(): boolean {
    return this.reports.length > 1;
  }

  get hasPrevious(): boolean {
    return this.currentIndex > 0;
  }

  get hasNext(): boolean {
    return this.currentIndex < this.reports.length - 1;
  }

  previous(): void {
    if (this.hasPrevious) this.currentIndex--;
  }

  next(): void {
    if (this.hasNext) this.currentIndex++;
  }

  close(): void {
    this.dialogRef.close();
  }
}
