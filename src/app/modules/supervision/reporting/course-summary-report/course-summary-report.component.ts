import { Component, Input, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReportSupervisionService } from '../report-supervision.service';
import { CourseReport, UnitReport } from '../../model/course-report.model';
import { ReflectionsDialogComponent } from './reflections-dialog/reflections-dialog.component';

@Component({
  selector: 'cc-course-summary-report',
  templateUrl: './course-summary-report.component.html',
  styleUrl: './course-summary-report.component.scss'
})
export class CourseSummaryReportComponent implements OnChanges {
  @Input() courseId: number;
  @Input() learnerId: number;
  report: CourseReport;

  constructor(
    private supervisionService: ReportSupervisionService,
    private dialog: MatDialog
  ) {}

  ngOnChanges(): void {
    if (!this.courseId || !this.learnerId) return;
    this.report = null;
    this.supervisionService.GetAchievements(this.courseId, this.learnerId).subscribe(data => {
      this.report = data;
      if (this.report.unitReports) {
        this.report.unitReports.sort((a, b) => a.order - b.order);
      }
    });
  }

  openReflectionsDialog(unit: UnitReport): void {
    this.dialog.open(ReflectionsDialogComponent, {
      data: unit,
      width: '700px',
      maxHeight: '80vh'
    });
  }
}
