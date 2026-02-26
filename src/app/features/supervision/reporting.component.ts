import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { CourseSummaryReportComponent } from '../../shared/reports/course-summary-report/course-summary-report.component';
import { CourseReportDialogComponent } from '../../shared/reports/course-report-dialog/course-report-dialog.component';
import { ReportSupervisionService } from './report-supervision.service';
import { SupervisionCourse } from './model/course.model';
import { SupervisionGroup } from './model/group.model';
import { SupervisionLearner } from './model/learner.model';

@Component({
  selector: 'cc-reporting',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatExpansionModule,
    MatDividerModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    CourseSummaryReportComponent,
  ],
  templateUrl: './reporting.component.html',
  styleUrl: './reporting.component.scss',
})
export class ReportingComponent {
  private readonly supervisionService = inject(ReportSupervisionService);
  private readonly dialog = inject(MatDialog);

  courses = signal<SupervisionCourse[]>([]);
  selectedCourse = signal<SupervisionCourse | null>(null);
  groups = signal<SupervisionGroup[]>([]);
  selectedLearner = signal<SupervisionLearner | null>(null);

  constructor() {
    this.supervisionService.getStartedCourses().subscribe(courses => this.courses.set(courses));
  }

  getGroups(): void {
    this.selectedLearner.set(null);
    const course = this.selectedCourse();
    if (!course?.id) return;

    this.supervisionService.getGroupedLearners(course.id).subscribe(groups => {
      groups.forEach(g => {
        g.learners?.sort((l1, l2) => l1.name > l2.name ? 1 : -1);
        g.learners?.forEach(l => {
          if (l.index.indexOf('@') > 0) l.index = l.index.split('@')[0];
          l.reports?.forEach(report => {
            const c = this.courses().find(c => c.id === report.courseId);
            if (c) {
              report.courseCode = c.code;
              report.courseName = c.name;
            }
          });
        });
      });
      this.groups.set(groups);
    });
  }

  hasReportFromOtherCourse(learner: SupervisionLearner): boolean {
    if (!learner.reports || !this.selectedCourse()?.id) return false;
    return learner.reports.some(report => report.courseId !== this.selectedCourse()!.id);
  }

  openOtherCourseReport(learner: SupervisionLearner, event: Event): void {
    event.stopPropagation();
    const courseId = this.selectedCourse()?.id;
    if (!learner.reports || !courseId) return;

    const otherCourseReports = learner.reports.filter(report => report.courseId !== courseId);
    if (otherCourseReports.length > 0) {
      this.dialog.open(CourseReportDialogComponent, {
        data: { reports: otherCourseReports, currentIndex: 0 },
        width: '90vw',
        maxWidth: '1400px',
        height: '90vh',
        maxHeight: '900px',
      });
    }
  }
}
