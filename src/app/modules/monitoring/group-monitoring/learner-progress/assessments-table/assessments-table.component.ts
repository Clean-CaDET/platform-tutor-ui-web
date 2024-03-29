import { trigger, style, transition, animate } from '@angular/animations';
import { Component, Input, OnChanges } from '@angular/core';
import { KnowledgeComponentProgress } from '../../../model/knowledge-component-progress.model';
import { KnowledgeComponent } from '../../../../learning/model/knowledge-component.model';
import { MatTableDataSource } from '@angular/material/table';
import { AssessmentItemMastery } from '../../../model/assessment-item-mastery.model';
import { EventService } from 'src/app/shared/events/event.service';

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
  isSuspicious: boolean
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

  constructor(private eventService: EventService) {}

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
      isSuspicious: p.isSuspicious,
    };
  }

  getEvents(learnerId: number, kcId: number): void {
    this.eventService.getByLearnerAndKc(learnerId, kcId).subscribe();
  }
}
