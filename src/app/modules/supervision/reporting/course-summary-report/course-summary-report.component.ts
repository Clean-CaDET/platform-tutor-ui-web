import { Component, Input, OnChanges } from '@angular/core';
import { ReportSupervisionService } from '../report-supervision.service';
import { CourseReport } from '../../model/course-report.model';

@Component({
  selector: 'cc-course-summary-report',
  templateUrl: './course-summary-report.component.html',
  styleUrl: './course-summary-report.component.scss'
})
export class CourseSummaryReportComponent implements OnChanges {
  @Input() courseId: number;
  @Input() learnerId: number;
  report: CourseReport;

  constructor(private supervisionService: ReportSupervisionService) {}

  ngOnChanges(): void {
    if (!this.courseId || !this.learnerId) return;
    this.report = null;
    this.supervisionService.GetAchievements(this.courseId, this.learnerId).subscribe(data => {
      this.report = data;
    });
  }
}
