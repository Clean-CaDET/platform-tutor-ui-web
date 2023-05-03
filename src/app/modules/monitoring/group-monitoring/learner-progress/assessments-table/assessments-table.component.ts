import { trigger, style, transition, animate } from '@angular/animations';
import { Component, Input, OnChanges } from '@angular/core';
import { KnowledgeComponentProgress } from '../../../model/knowledge-component-progress.model';
import { KnowledgeComponent } from '../../../../learning/model/knowledge-component.model';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { AssessmentItemMastery } from '../../../model/assessment-item-mastery.model';
import { LearningEvent } from 'src/app/modules/knowledge-analytics/model/learning-event.model';
import { ngxCsv } from 'ngx-csv';
import { GroupMonitoringService } from '../../group-monitoring.service';

interface AssessmentTableElement {
  kcOrder: number,
  kcCode: string,
  kcName: string,
  kcId: number,
  mastery: number,
  totalCount: number,
  passedCount: number,
  attemptedCount: number,
  activeSessionInMinutes: number,
  expectedDurationInMinutes: number,
  assessmentItemMasteries: AssessmentItemMastery[],
}

@Component({
  selector: 'cc-assessments-table',
  templateUrl: './assessments-table.component.html',
  styleUrls: ['./assessments-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('0.2s ease-out', style({ height: '*', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ height: '*', opacity: 1 }),
        animate('0.2s ease-in', style({ height: 0, opacity: 0 })),
      ]),
    ]),
  ],
})
export class AssessmentsTableComponent implements OnChanges {
  @Input() knowledgeComponentProgresses: KnowledgeComponentProgress[];
  @Input() kcs: KnowledgeComponent[];
  dataSource: MatTableDataSource<AssessmentTableElement>;
  displayedColumns: string[] = [
    'name',
    'mastery',
    'totalCount',
    'passedCount',
    'attemptedCount',
    'time',
  ];
  expandedElement: AssessmentTableElement = {} as AssessmentTableElement;

  constructor(private monitoringService: GroupMonitoringService) {}

  ngOnChanges(): void {
    const dataSource: AssessmentTableElement[] = [];
    this.kcs.forEach((kc) => {
      this.knowledgeComponentProgresses.forEach((p) => {
        if (kc.id === p.knowledgeComponentId) {
          dataSource.push(this.createAssessmentTableElement(kc, p));
        }
      });
    });
    dataSource.sort( (te1, te2) => te1.kcOrder - te2.kcOrder)
    this.dataSource = new MatTableDataSource(dataSource);
  }

  private createAssessmentTableElement(kc: KnowledgeComponent, p: KnowledgeComponentProgress): AssessmentTableElement {
    return {
      kcOrder: kc.order,
      kcCode: kc.code,
      kcName: kc.name,
      kcId: kc.id,
      mastery: p.statistics.mastery,
      totalCount: p.statistics.totalCount,
      passedCount: p.statistics.passedCount,
      attemptedCount: p.statistics.attemptedCount,
      activeSessionInMinutes: p.activeSessionInMinutes,
      expectedDurationInMinutes: kc.expectedDurationInMinutes,
      assessmentItemMasteries: p.assessmentItemMasteries,
    };
  }

  getEvents(learnerId: number, kcId: number): void {
    this.monitoringService.getEvents(learnerId, kcId).subscribe(data => this.exportToCSV(data));
  }

  exportToCSV(events: LearningEvent[]): void {
    for (const event of events) {
      if (event.specificData) {
        event.specificData = JSON.stringify(event.specificData);
      }
    }

    events = events.sort((a, b) => a.timeStamp.getTime() - b.timeStamp.getTime());
    new ngxCsv(events, 'Events', {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      useBom: true,
      noDownload: false,
      headers: [
        'Type',
        'Timestamp',
        'Knowledge Component Id',
        'Learner Id',
        'Event-specific data',
      ],
    });
  }
}
