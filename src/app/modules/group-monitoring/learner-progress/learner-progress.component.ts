import {
  Component,
  Input,
  OnChanges
} from '@angular/core';
import {Course} from '../../learning/course/course.model';
import {LearnerProgress} from '../model/learner-progress';
import {Unit} from '../../learning/unit/unit.model';
import {KnowledgeComponentProgress} from '../model/knowledge-component-progress';
import {KnowledgeComponent} from '../../learning/knowledge-component/model/knowledge-component.model';

@Component({
  selector: 'cc-learner-progress',
  templateUrl: './learner-progress.component.html',
  styleUrls: ['./learner-progress.component.scss'],
})
export class LearnerProgressComponent implements OnChanges {
  @Input() unitId = 0;
  @Input() learnerProgress: LearnerProgress;
  @Input() course: Course;

  kcNum = 0;
  satisfiedNum = 0;
  suspiciousNum = 0;
  filteredLearnerProgress: KnowledgeComponentProgress[];
  unit: Unit;

  constructor() {}

  ngOnChanges(): void {
    this.calculateProgress();
  }

  calculateProgress(): void {
    const filteredKnowledgeComponentProgress: KnowledgeComponentProgress[] = this.filterKc();
    this.filteredLearnerProgress = filteredKnowledgeComponentProgress;
    this.kcNum = filteredKnowledgeComponentProgress.length;
    this.satisfiedNum = this.calculateSatisfiedKc(filteredKnowledgeComponentProgress);
    this.suspiciousNum = this.calculateSuspiciousKc(filteredKnowledgeComponentProgress);
  }

  filterKc(): KnowledgeComponentProgress[] {
    const knowledgeUnit: Unit = this.course.knowledgeUnits.find((ku) => ku.id === this.unitId);
    this.unit = knowledgeUnit;
    const filteredKnowledgeComponentProgress: KnowledgeComponentProgress[] = [];
    this.learnerProgress.knowledgeComponentProgress.forEach(kcp => {
      knowledgeUnit.knowledgeComponents.forEach(kc => {
        if (kcp.knowledgeComponentId === kc.id) {
          filteredKnowledgeComponentProgress.push(kcp);
        }
      });
    });

    return filteredKnowledgeComponentProgress;
  }

  calculateSatisfiedKc(knowledgeComponentProgress: KnowledgeComponentProgress[]): number {
    return knowledgeComponentProgress.filter((p) => {
      p.statistics.isSatisfied;
    }).length;
  }

  calculateSuspiciousKc(knowledgeComponentProgress: KnowledgeComponentProgress[]): number {
    let suspiciousNum = 0;
    const knowledgeUnit: Unit = this.course.knowledgeUnits.find((ku) => ku.id === this.unitId);
    knowledgeComponentProgress.forEach(p => {
      const kc: KnowledgeComponent = knowledgeUnit.knowledgeComponents.find(k => k.id === p.knowledgeComponentId);
      if (p.statistics.isSatisfied === true && p.durationOfFinishedSessionsInMinutes > kc.expectedDurationInMinutes) {
        suspiciousNum++;
      }
    });
    return suspiciousNum;
  }
}
