import { Component, Input, OnChanges } from '@angular/core';
import {KnowledgeComponentProgress} from '../../model/knowledge-component-progress.model';
import { Learner } from 'src/app/modules/knowledge-analytics/model/learner.model';
import { LearnerProgress } from '../../model/learner-progress.model';
import { GroupMonitoringService } from '../group-monitoring.service';
import { Unit } from 'src/app/modules/learning/model/unit.model';

@Component({
  selector: 'cc-learner-progress',
  templateUrl: './learner-progress.component.html',
  styleUrls: ['./learner-progress.component.scss'],
})
export class LearnerProgressComponent implements OnChanges {
  @Input() learners: Learner[];
  @Input() unit: Unit;
  progresses: LearnerProgress[] = [];
  progressBarActive = false;
  suspiciousKcNum: number = 0;

  constructor(private monitoringService: GroupMonitoringService) {}

  ngOnChanges(): void {
    this.progresses = [];
    if(this.unit) {
      this.calculateProgress();
    }
  }

  calculateProgress(): void {
    this.progressBarActive = true;
    this.monitoringService.getProgress(this.unit.id, this.learners.map(l => l.id))
      .subscribe(allProgress => {
        this.learners.forEach(learner => {
          let learnerKcProgress = allProgress.filter(p => p.learnerId === learner.id);
          this.progresses.push({
            learner,
            knowledgeComponentProgress: learnerKcProgress,
            kcCount: learnerKcProgress.length,
            satisfiedCount: learnerKcProgress.filter(p => p.statistics.isSatisfied).length,
            suspiciousCount: this.countSuspiciousKcs(learnerKcProgress)
          });
        });
        this.progressBarActive = false;
      });
  }

  private countSuspiciousKcs(knowledgeComponentProgress: KnowledgeComponentProgress[]): number {
    let suspiciousNum = 0;
    knowledgeComponentProgress.forEach(p => {
      let allSubmissions = 0;
      p.assessmentItemMasteries.forEach(ai => {
        allSubmissions += ai.submissionCount;
      })
      const averageSubmissionCount = allSubmissions / p.assessmentItemMasteries.length
      let kc = this.unit.knowledgeComponents.find(kc => kc.id === p.knowledgeComponentId);

      if (p.statistics.isSatisfied && p.durationOfAllSessionsInMinutes >= kc.expectedDurationInMinutes) {
        return
      }
      else if (p.statistics.isSatisfied && averageSubmissionCount < 2) {
        return
      } else if (p.statistics.isSatisfied && p.durationOfAllSessionsInMinutes >= kc.expectedDurationInMinutes * 0.75 && averageSubmissionCount < 1.5) {
        return
      } else if (p.statistics.isSatisfied) {
        suspiciousNum++;
      }
    });
    return suspiciousNum;
  }

  public shouldAlert(learnerProgress: LearnerProgress): boolean {
    if (learnerProgress.kcCount - learnerProgress.satisfiedCount == 1 || learnerProgress.suspiciousCount == 1) {
      return true
    } else return learnerProgress.kcCount - learnerProgress.satisfiedCount >= 2 || learnerProgress.suspiciousCount >= 2 ||
      learnerProgress.kcCount - learnerProgress.satisfiedCount >= 1 && learnerProgress.suspiciousCount >= 1;
  }

  public getAlertColor(learnerProgress: LearnerProgress): string {
    if (learnerProgress.kcCount - learnerProgress.satisfiedCount == 1 || learnerProgress.suspiciousCount == 1) {
      return 'accent'
    } else {
      return 'warn'
    }
  }
}
