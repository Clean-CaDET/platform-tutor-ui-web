import { Component, Input, OnChanges } from '@angular/core';
import {KnowledgeComponentProgress} from '../../model/knowledge-component-progress.model';
import { Learner } from 'src/app/modules/knowledge-analytics/model/learner.model';
import { KnowledgeComponent } from 'src/app/modules/learning/model/knowledge-component.model';
import { LearnerProgress } from '../../model/learner-progress.model';
import { GroupMonitoringService } from '../group-monitoring.service';
import { Course } from 'src/app/modules/learning/model/course.model';

@Component({
  selector: 'cc-learner-progress',
  templateUrl: './learner-progress.component.html',
  styleUrls: ['./learner-progress.component.scss'],
})
export class LearnerProgressComponent implements OnChanges {
  @Input() learners: Learner[];
  @Input() course: Course;
  @Input() unitId: number;
  knowledgeComponents: KnowledgeComponent[];
  progresses: LearnerProgress[] = [];

  kcNum = 0;
  satisfiedNum = 0;
  suspiciousNum = 0;

  progressBarActive = false;

  constructor(private monitoringService: GroupMonitoringService) {}

  ngOnChanges(): void {
    if(this.unitId) {
      this.knowledgeComponents = this.course.knowledgeUnits.find((ku) => ku.id === this.unitId).knowledgeComponents;
      this.calculateProgress();
    }
  }

  calculateProgress(): void {
    this.progressBarActive = true;
    this.monitoringService.getProgress(this.course.id, this.unitId, this.learners.map(l => l.id))
      .subscribe(allProgress => {
        this.progresses = [];
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
      let kc = this.knowledgeComponents.find(kc => kc.id === p.knowledgeComponentId);
      if (p.statistics.isSatisfied && p.durationOfAllSessionsInMinutes < kc.expectedDurationInMinutes) {
        suspiciousNum++;
      }
    });
    return suspiciousNum;
  }
}
