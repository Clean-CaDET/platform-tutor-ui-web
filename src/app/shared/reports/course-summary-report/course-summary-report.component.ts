import { Component, ChangeDetectionStrategy, inject, input, signal, effect } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HttpContext } from '@angular/common/http';
import { NotificationService } from '../../../core/notification/notification.service';
import { SKIP_GLOBAL_ERROR } from '../../../core/http/global-ui.interceptor';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { CourseReport, UnitReport, FeedbackItemAggregate } from '../course-report.model';
import { ReflectionsDialogComponent } from '../reflections-dialog/reflections-dialog.component';
import { FEEDBACK_ITEM_CONFIGS, GROUP_TITLES } from './feedback-config';
import { ReportService } from './report.service';

interface FeedbackTableRow {
  label: string;
  code: string;
  beginning: string;
  middle: string;
  end: string;
}

@Component({
  selector: 'cc-course-summary-report',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule, MatTableModule, MatFormFieldModule, MatInputModule,
    MatIconModule, MatButtonModule, MatDividerModule,
  ],
  templateUrl: './course-summary-report.component.html',
  styleUrl: './course-summary-report.component.scss',
})
export class CourseSummaryReportComponent {
  private readonly reportService = inject(ReportService);
  private readonly dialog = inject(MatDialog);
  private readonly notify = inject(NotificationService);

  readonly courseId = input<number>(0);
  readonly learnerId = input<number>(0);
  readonly courseReport = input<CourseReport | undefined>(undefined);
  readonly readOnly = input(false);

  readonly report = signal<CourseReport | null>(null);
  readonly feedbackTableData = signal<FeedbackTableRow[]>([]);

  originalReport = '';
  reportForm = new FormGroup({ reportText: new FormControl('') });

  constructor() {
    effect(() => {
      const cr = this.courseReport();
      if (cr) {
        this.processReport(cr);
      } else {
        const courseId = this.courseId();
        const learnerId = this.learnerId();
        if (courseId && learnerId) {
          this.report.set(null);
          this.reportService.get(courseId, learnerId).subscribe(data => {
            this.processReport(data);
          });
        }
      }
    });
  }

  private processReport(data: CourseReport): void {
    if (data.unitReports) {
      data.unitReports.sort((a, b) => a.order - b.order);
    }
    this.report.set(data);
    this.originalReport = data.report || '';
    this.reportForm.patchValue({ reportText: this.originalReport });
    if (data.feedbackItemAggregates?.length) {
      this.prepareFeedbackTableData(data);
    }
  }

  get hasReportChanged(): boolean {
    const currentReport = this.reportForm.get('reportText')?.value || '';
    return currentReport !== this.originalReport;
  }

  openReflectionsDialog(unit: UnitReport): void {
    this.dialog.open(ReflectionsDialogComponent, {
      data: unit,
      width: '700px',
      maxHeight: '80vh',
    });
  }

  private prepareFeedbackTableData(reportData: CourseReport): void {
    const feedbackByCode = new Map<string, FeedbackItemAggregate[]>();
    reportData.feedbackItemAggregates!.forEach(item => {
      if (!feedbackByCode.has(item.code)) {
        feedbackByCode.set(item.code, []);
      }
      feedbackByCode.get(item.code)!.push(item);
    });

    this.feedbackTableData.set(FEEDBACK_ITEM_CONFIGS.map(config => {
      const items = feedbackByCode.get(config.code) || [];
      items.sort((a, b) => Math.min(...a.weeks) - Math.min(...b.weeks));
      return {
        label: config.label,
        code: config.code,
        beginning: items[0] ? this.getValue(items[0]) : '-',
        middle: items[1] ? this.getValue(items[1]) : '-',
        end: items[2] ? this.getValue(items[2]) : '-',
      };
    }));
  }

  getValue(item: FeedbackItemAggregate): string {
    if (!item.hasData) {
      return 'Nemamo mišljenje';
    }
    const config = FEEDBACK_ITEM_CONFIGS.find(c => c.code === item.code);
    if (!config) return '-';
    if (item.average >= config.thresholds.high) {
      return config.labels.high;
    } else if (item.average >= config.thresholds.medium) {
      return config.labels.medium;
    } else {
      return config.labels.low;
    }
  }

  copyToClipboard(): void {
    const r = this.report();
    if (!r) return;
    const results = `## Procenat pređenih lekcija: ${r.satisfiedUnitPercent}\n## Procenat značajnih refleksija ${r.meaningfulReflectionAnswerPercent}\n`;
    const feedbackJson = JSON.stringify(this.feedbackTableData(), null, 2);
    navigator.clipboard.writeText(results + feedbackJson);
  }

  saveReport(): void {
    const r = this.report();
    if (!r) return;
    const updatedReport: CourseReport = {
      ...r,
      report: this.reportForm.get('reportText')!.value!,
    };
    const ctx = new HttpContext().set(SKIP_GLOBAL_ERROR, true);
    this.reportService.saveOrUpdate(updatedReport, ctx).subscribe({
      next: (result) => {
        this.report.set(result);
        this.originalReport = result.report;
        this.notify.success('Izveštaj sačuvan!');
      },
      error: () => {
        this.notify.error('Greška pri čuvanju.');
      },
    });
  }

  resetReport(): void {
    this.reportForm.patchValue({ reportText: this.originalReport });
    this.notify.info('Izveštaj vraćen na prethodnu verziju');
  }

  reloadStats(): void {
    this.reportService.getAchievements(this.courseId(), this.learnerId()).subscribe(data => {
      data.report = this.reportForm.get('reportText')!.value!;
      data.id = this.report()!.id;
      this.processReport(data);
    });
  }
}
