import { trigger, style, transition, animate } from '@angular/animations';
import { Component, Input, OnChanges } from '@angular/core';
import { KnowledgeComponentProgress } from '../../model/knowledge-component-progress';
import { Unit } from '../../../learning/model/unit.model';
import { KnowledgeComponent } from '../../../learning/model/knowledge-component.model';
import { MatTableDataSource } from '@angular/material/table';
import { AssessmentItemMastery } from '../../model/assessment-item-mastery';

interface AssessmentTableElement {
  kcCode: string,
  kcName: string,
  kcId: number,
  mastery: number,
  totalCount: number,
  passedCount: number,
  attemptedCount: number,
  durationOfFinishedSessionsInMinutes: number,
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
  @Input() unit: Unit;
  @Input() kcUnitId: number;
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

  constructor() {}

  ngOnChanges(): void {
    const dataSource: AssessmentTableElement[] = [];
    this.unit.knowledgeComponents.forEach((kc) => {
      this.knowledgeComponentProgresses.forEach((p) => {
        if (kc.id === p.knowledgeComponentId) {
          dataSource.push(this.createAssessmentTableElement(kc, p));
        }
      });
    });
    this.dataSource = new MatTableDataSource(dataSource);
  }

  private createAssessmentTableElement(
    kc: KnowledgeComponent,
    p: KnowledgeComponentProgress
  ): AssessmentTableElement {
    return {
      kcCode: kc.code,
      kcName: kc.name,
      kcId: kc.id,
      mastery: p.statistics.mastery,
      totalCount: p.statistics.totalCount,
      passedCount: p.statistics.passedCount,
      attemptedCount: p.statistics.attemptedCount,
      durationOfFinishedSessionsInMinutes:
        p.durationOfFinishedSessionsInMinutes,
      expectedDurationInMinutes: kc.expectedDurationInMinutes,
      assessmentItemMasteries: p.assessmentItemMasteries,
    };
  }
}
