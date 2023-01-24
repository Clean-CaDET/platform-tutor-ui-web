import { Component, Input, OnChanges } from '@angular/core';
import {KnowledgeComponentProgress} from '../../model/knowledge-component-progress.model';
import {LearnerProgress} from '../../model/learner-progress.model';
import {KnowledgeComponent} from '../../../learning/model/knowledge-component.model';

@Component({
  selector: 'cc-learner-progress',
  templateUrl: './learner-progress.component.html',
  styleUrls: ['./learner-progress.component.scss'],
})
export class LearnerProgressComponent implements OnChanges {
  @Input() learnerProgress: LearnerProgress;
  @Input() kcs: KnowledgeComponent[] = [];

  kcNum = 0;
  satisfiedNum = 0;
  suspiciousNum = 0;
  filteredLearnerProgress: KnowledgeComponentProgress[];

  constructor() {}

  ngOnChanges(): void {
    this.calculateProgress();
  }

  calculateProgress(): void {
    this.filteredLearnerProgress = this.filterKc();
    this.kcNum = this.filteredLearnerProgress.length;
    this.satisfiedNum = this.calculateSatisfiedKc();
    this.suspiciousNum = this.calculateSuspiciousKc();
  }

  filterKc(): KnowledgeComponentProgress[] {
    const filteredKnowledgeComponentProgress: KnowledgeComponentProgress[] = [];
    this.learnerProgress.knowledgeComponentProgress.forEach(kcp => {
      this.kcs.forEach(kc => {
        if (kcp.knowledgeComponentId === kc.id) {
          filteredKnowledgeComponentProgress.push(kcp);
        }
      });
    });
    return filteredKnowledgeComponentProgress;
  }

  calculateSatisfiedKc(): number {
    let satisfied = 0;
    this.filteredLearnerProgress.forEach(p => {
      if (p.statistics.isSatisfied) {
        satisfied++;
      }
    });
    return satisfied;
  }

  calculateSuspiciousKc(): number {
    let suspiciousNum = 0;
    this.filteredLearnerProgress.forEach(p => {
      this.kcs.forEach(kc => {
        if (p.knowledgeComponentId === kc.id && p.statistics.isSatisfied === true
          && p.durationOfAllSessionsInMinutes < kc.expectedDurationInMinutes) {
          suspiciousNum++;
        }
      });
    });
    return suspiciousNum;
  }
}
