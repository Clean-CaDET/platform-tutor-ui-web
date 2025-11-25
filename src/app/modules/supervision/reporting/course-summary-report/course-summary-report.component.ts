import { Component, Input, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReportSupervisionService } from '../report-supervision.service';
import { CourseReport, UnitReport, FeedbackItemAggregate } from '../../model/course-report.model';
import { ReflectionsDialogComponent } from './reflections-dialog/reflections-dialog.component';
import { FEEDBACK_ITEM_CONFIGS, GROUP_TITLES } from './feedback-config';

@Component({
  selector: 'cc-course-summary-report',
  templateUrl: './course-summary-report.component.html',
  styleUrl: './course-summary-report.component.scss'
})
export class CourseSummaryReportComponent implements OnChanges {
  @Input() courseId: number;
  @Input() learnerId: number;
  report: CourseReport;
  groupedFeedbackItems: { title: string; items: FeedbackItemAggregate[] }[] = [];
  feedbackTableData: { label: string; code: string; beginning: string; middle: string; end: string }[] = [];

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
      if (this.report.feedbackItemAggregates) {
        this.groupFeedbackItems();
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
}
