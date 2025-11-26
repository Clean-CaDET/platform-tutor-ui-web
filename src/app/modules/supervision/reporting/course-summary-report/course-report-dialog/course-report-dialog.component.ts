import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CourseReport } from '../../../model/course-report.model';

interface DialogData {
  reports: CourseReport[];
  currentIndex: number;
}

@Component({
  selector: 'cc-course-report-dialog',
  templateUrl: './course-report-dialog.component.html',
  styleUrl: './course-report-dialog.component.scss'
})
export class CourseReportDialogComponent {
  reports: CourseReport[];
  currentIndex: number;

  constructor(
    public dialogRef: MatDialogRef<CourseReportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.reports = data.reports;
    this.currentIndex = data.currentIndex;
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
    if (this.hasPrevious) {
      this.currentIndex--;
    }
  }

  next(): void {
    if (this.hasNext) {
      this.currentIndex++;
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
