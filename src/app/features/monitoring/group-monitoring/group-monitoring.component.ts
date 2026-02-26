import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { Group } from '../model/group.model';
import { Learner } from '../model/learner.model';
import { GradingTaskProgress } from '../grading/model/grading-progress.model';
import { WeeklyFeedback } from '../weekly-feedback/weekly-feedback.model';
import { GroupMonitoringService } from './group-monitoring.service';
import { WeeklyFeedbackService } from '../weekly-feedback/weekly-feedback.service';
import { ReportService } from '../../../shared/reports/course-summary-report/report.service';
import { CourseReportDialogComponent } from '../../../shared/reports/course-report-dialog/course-report-dialog.component';
import { EnrollmentsComponent } from '../enrollments/enrollments.component';
import { GradingComponent } from '../grading/grading.component';
import { WeeklyProgressComponent } from '../weekly-progress/weekly-progress.component';
import { CourseSummaryReportComponent } from '../../../shared/reports/course-summary-report/course-summary-report.component';

@Component({
  selector: 'cc-group-monitoring',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
  imports: [
    ScrollingModule,
    MatFormFieldModule, MatSelectModule, MatInputModule, MatIconModule,
    MatButtonModule, MatDividerModule, MatTooltipModule, MatDatepickerModule,
    EnrollmentsComponent, GradingComponent, WeeklyProgressComponent, CourseSummaryReportComponent,
  ],
  templateUrl: './group-monitoring.component.html',
  styleUrl: './group-monitoring.component.scss',
})
export class GroupMonitoringComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly groupMonitoringService = inject(GroupMonitoringService);
  private readonly feedbackService = inject(WeeklyFeedbackService);
  private readonly reportService = inject(ReportService);
  private readonly dialog = inject(MatDialog);

  readonly mode = signal<'enrollments' | 'grading' | 'progress' | 'report'>('enrollments');
  readonly courseId = signal(0);
  readonly groups = signal<Group[]>([]);
  readonly learners = signal<Learner[]>([]);
  readonly selectedLearner = signal<Learner | null>(null);

  readonly selectedGroupId = signal(0);
  readonly selectedDate = signal(new Date());

  constructor() {
    this.route.params.pipe(takeUntilDestroyed()).subscribe(params => {
      this.mode.set(params['mode'] as 'enrollments' | 'grading' | 'progress' | 'report');
      if (this.courseId() === +params['courseId']) {
        this.getGroupFeedback();
        return;
      }
      this.courseId.set(+params['courseId']);
      this.getLearnerGroups();
    });

    this.feedbackService.weeklyFeedbackObserver.pipe(takeUntilDestroyed()).subscribe(feedback => {
      const sl = this.selectedLearner();
      if (sl) this.setSemaphore(sl, feedback);
    });
  }

  private getLearnerGroups(): void {
    this.selectedGroupId.set(0);
    this.learners.set([]);
    this.groupMonitoringService.getGroups(this.courseId()).subscribe(groupsPage => {
      this.groups.set(groupsPage.results);
      this.selectedGroupId.set(groupsPage.results[0]?.id ?? 0);
      if (this.selectedGroupId()) this.getLearners();
    });
  }

  getLearners(): void {
    this.groupMonitoringService.getLearners(this.selectedGroupId(), this.courseId())
      .subscribe(data => {
        this.selectedLearner.set(null);
        const sorted = data.results
          .map(l => l.index.indexOf('@') > 0 ? { ...l, index: l.index.split('@')[0] } : l)
          .sort((l1, l2) => l1.name > l2.name ? 1 : -1);
        this.learners.set(sorted);
        this.changeLearner(sorted[0]);
        this.getGroupFeedback();
        this.getLearnerReports();
      });
  }

  getGroupFeedback(): void {
    if (!this.selectedDate() || this.mode() !== 'progress') return;
    const learners = this.learners();
    if (!learners.length) return;

    this.feedbackService.getByGroup(this.courseId(), learners.map(l => l.id), this.selectedDate())
      .subscribe(feedback => {
        const updated = learners.map(l => {
          const relatedFeedback = feedback.find(f => f.learnerId === l.id);
          return { ...l, semaphore: relatedFeedback?.semaphore ?? 0, semaphoreJustification: relatedFeedback?.semaphoreJustification ?? '' };
        });
        this.learners.set(updated);
      });
  }

  private setSemaphore(learner: Learner, feedback: WeeklyFeedback | null): void {
    const updated = this.learners().map(l =>
      l.id === learner.id
        ? { ...l, semaphore: feedback?.semaphore ?? 0, semaphoreJustification: feedback?.semaphoreJustification ?? '' }
        : l,
    );
    this.learners.set(updated);
  }

  getTaskSummaries(taskProgress: GradingTaskProgress[]): void {
    const progressByLearner = new Map<number, GradingTaskProgress[]>();
    taskProgress.forEach(p => {
      const list = progressByLearner.get(p.learnerId) ?? [];
      list.push(p);
      progressByLearner.set(p.learnerId, list);
    });

    const updated = this.learners().map(l => {
      const lp = progressByLearner.get(l.id) ?? [];
      return {
        ...l,
        completedTaskCount: lp.filter(p => p.status === 'Completed').length,
        completedStepCount: lp.flatMap(p => p.stepProgresses ?? []).filter(p => p.status === 'Answered').length,
      };
    });
    this.learners.set(updated);
  }

  onDateChange(event: MatDatepickerInputEvent<Date>): void {
    if (!event?.value) return;
    this.selectedDate.set(event.value);
    this.getGroupFeedback();
  }

  changeLearner(learner: Learner): void {
    this.selectedLearner.set(learner);
  }

  private getLearnerReports(): void {
    if (this.mode() !== 'report') return;
    const learners = this.learners();
    if (!learners.length) return;

    this.reportService.getMany(learners.map(l => l.id)).subscribe(reports => {
      const updated = learners.map(l => ({
        ...l,
        reports: reports.filter(r => r.learnerId === l.id),
      }));
      this.learners.set(updated);
    });
  }

  hasReportFromOtherCourse(learner: Learner): boolean {
    if (!learner.reports || !this.courseId()) return false;
    return learner.reports.some(report => report.courseId !== this.courseId());
  }

  openOtherCourseReport(learner: Learner, event: Event): void {
    event.stopPropagation();
    if (!learner.reports || !this.courseId()) return;
    const otherCourseReports = learner.reports.filter(report => report.courseId !== this.courseId());
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
