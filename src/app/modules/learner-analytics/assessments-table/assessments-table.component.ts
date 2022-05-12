import { trigger, style, transition, animate } from '@angular/animations';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'cc-assessments-table',
  templateUrl: './assessments-table.component.html',
  styleUrls: ['./assessments-table.component.scss'],
  animations: [
    trigger(
      'detailExpand', 
      [
        transition(
          ':enter', 
          [
            style({ height: 0, opacity: 0 }),
            animate('0.2s ease-out', style({ height: '*', opacity: 1 }))
          ]
        ),
        transition(
          ':leave', 
          [
            style({ height: '*', opacity: 1 }),
            animate('0.2s ease-in', style({ height: 0, opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class AssessmentsTableComponent implements OnChanges {
  @Input() knowledgeComponentMasteries: any[];
  @Input() kcUnitId: number;
  dataSource;
  displayedColumns: string[] = ['name', 'mastery', 'totalCount', 'completedCount', 'attemptedCount'];
  expandedElement = new Object();

  constructor() { }

  ngOnChanges(): void {
    if(+this.kcUnitId == 0) this.dataSource = this.knowledgeComponentMasteries;
    else this.dataSource = this.knowledgeComponentMasteries.filter(kcm => kcm.kcUnitId == this.kcUnitId);
  }
}
