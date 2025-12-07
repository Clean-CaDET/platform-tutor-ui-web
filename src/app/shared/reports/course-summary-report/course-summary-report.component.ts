import { Component, Input, OnChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseReport, UnitReport, FeedbackItemAggregate } from '../course-report.model';
import { ReflectionsDialogComponent } from '../reflections-dialog/reflections-dialog.component';
import { FEEDBACK_ITEM_CONFIGS, GROUP_TITLES } from './feedback-config';
import { ReportService } from './report.service';

@Component({
  selector: 'cc-course-summary-report',
  templateUrl: './course-summary-report.component.html',
  styleUrl: './course-summary-report.component.scss'
})
export class CourseSummaryReportComponent implements OnChanges {
  @Input() courseId: number;
  @Input() learnerId: number;
  @Input() courseReport: CourseReport;
  @Input() readOnly: boolean = false;
  report: CourseReport;
  originalReport: string;
  reportForm: FormGroup;
  groupedFeedbackItems: { title: string; items: FeedbackItemAggregate[] }[] = [];
  feedbackTableData: { label: string; code: string; beginning: string; middle: string; end: string }[] = [];

  constructor(
    private reportService: ReportService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.reportForm = new FormGroup({
      reportText: new FormControl('')
    });
  }

  ngOnChanges(): void {
    if (this.courseReport) {
      // Read-only mode: use provided report
      this.report = this.courseReport;
      this.originalReport = this.courseReport.report || '';
      this.reportForm.patchValue({ reportText: this.originalReport });
      if (this.report.unitReports) {
        this.report.unitReports.sort((a, b) => a.order - b.order);
      }
      if (this.report.feedbackItemAggregates?.length) {
        this.groupFeedbackItems();
      }
    } else if (this.courseId && this.learnerId) {
      // Normal mode: fetch report
      this.report = null;
      this.reportService.get(this.courseId, this.learnerId).subscribe(data => {
        this.report = data;
        this.originalReport = data.report || '';
        this.reportForm.patchValue({ reportText: this.originalReport });
        if (this.report.unitReports) {
          this.report.unitReports.sort((a, b) => a.order - b.order);
        }
        if (this.report.feedbackItemAggregates?.length) {
          this.groupFeedbackItems();
        }
      });
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
      maxHeight: '80vh'
    });
  }

  groupFeedbackItems(): void {
    const groups = new Map<number, FeedbackItemAggregate[]>();
    
    this.report.feedbackItemAggregates.forEach(item => {
      const minWeek = Math.min(...item.weeks);
      if (!groups.has(minWeek)) {
        groups.set(minWeek, []);
      }
      groups.get(minWeek).push(item);
    });
    
    const sortedGroups = Array.from(groups.entries())
      .sort((a, b) => a[0] - b[0])
      .slice(0, 3);
    
    this.groupedFeedbackItems = sortedGroups.map((group, index) => ({
      title: GROUP_TITLES[index] || `Grupa ${index + 1}`,
      items: this.sortItemsByCode(group[1])
    }));

    this.prepareFeedbackTableData();
  }

  prepareFeedbackTableData(): void {
    const feedbackByCode = new Map<string, FeedbackItemAggregate[]>();
    
    this.report.feedbackItemAggregates.forEach(item => {
      if (!feedbackByCode.has(item.code)) {
        feedbackByCode.set(item.code, []);
      }
      feedbackByCode.get(item.code).push(item);
    });

    this.feedbackTableData = FEEDBACK_ITEM_CONFIGS.map(config => {
      const items = feedbackByCode.get(config.code) || [];
      items.sort((a, b) => Math.min(...a.weeks) - Math.min(...b.weeks));
      
      return {
        label: config.label,
        code: config.code,
        beginning: items[0] ? this.getValue(items[0]) : '-',
        middle: items[1] ? this.getValue(items[1]) : '-',
        end: items[2] ? this.getValue(items[2]) : '-'
      };
    });
  }

  sortItemsByCode(items: FeedbackItemAggregate[]): FeedbackItemAggregate[] {
    const codeOrder = FEEDBACK_ITEM_CONFIGS.map(c => c.code);
    return items.sort((a, b) => codeOrder.indexOf(a.code) - codeOrder.indexOf(b.code));
  }

  getLabel(code: string): string {
    return FEEDBACK_ITEM_CONFIGS.find(c => c.code === code)?.label || code;
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
    const results = `## Procenat pređenih lekcija: ${this.report.satisfiedUnitPercent}\n## Procenat značajnih refleksija ${this.report.meaningfulReflectionAnswerPercent}\n`;
    const feedbackJson = JSON.stringify(this.feedbackTableData, null, 2);
    navigator.clipboard.writeText(results + feedbackJson);
  }

  saveReport(): void {
    const updatedReport: CourseReport = {
      ...this.report,
      report: this.reportForm.get('reportText').value
    };
    
    this.reportService.saveOrUpdate(updatedReport).subscribe({
      next: (result) => {
        this.report = result;
        this.originalReport = result.report;
        this.snackBar.open('Izveštaj sačuvan!', 'Zatvori', {
          duration: 3000,
          horizontalPosition:'right'
        });
      },
      error: (err) => {
        this.snackBar.open('Greška pri čuvanju.', 'Zatvori', {
          duration: 3000,
          horizontalPosition:'right'
        });
      }
    });
  }

  resetReport(): void {
    this.reportForm.patchValue({ reportText: this.originalReport });
    this.snackBar.open('Izveštaj vraćen na prethodnu verziju', 'Zatvori', {
      duration: 2000,
      horizontalPosition:'right'
    });
  }

  reloadStats(): void {
    this.reportService.getAchievements(this.courseId, this.learnerId).subscribe(data => {
      data.report = this.reportForm.get('reportText').value;
      data.id = this.report.id;
      this.report = data;
      if (this.report.unitReports) {
        this.report.unitReports.sort((a, b) => a.order - b.order);
      }
      if (this.report.feedbackItemAggregates?.length) {
        this.groupFeedbackItems();
      }
    });
  }
}
