import { Component, Input, OnChanges } from '@angular/core';
import {KnowledgeComponentProgress} from '../../model/knowledge-component-progress.model';
import { Learner } from 'src/app/modules/monitoring/model/learner.model';
import { LearnerProgress } from '../../model/learner-progress.model';
import { GroupMonitoringService } from '../group-monitoring.service';
import { Unit } from 'src/app/modules/learning/model/unit.model';
import * as FileSaver from "file-saver";
import { KnowledgeComponentService } from 'src/app/modules/authoring/knowledge-component/knowledge-component-authoring.service';

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

  constructor(private monitoringService: GroupMonitoringService, private kcService: KnowledgeComponentService) {}

  ngOnChanges(): void {
    this.progresses = [];
    if(this.unit) {
      if(this.learners.length == 0) return;
      this.progressBarActive = true;
      if(!this.unit.knowledgeComponents || this.unit.knowledgeComponents.length == 0) {
        this.kcService.getByUnit(this.unit.id).subscribe(kcs => {
          this.unit.knowledgeComponents = kcs;
          this.calculateProgress();
        });
      } else {
        this.calculateProgress();
      }
    }
  }

  calculateProgress(): void {
    this.monitoringService.getProgress(this.unit.id, this.learners.map(l => l.id))
      .subscribe(allProgress => {
        this.learners.forEach(learner => {
          let learnerKcProgress = allProgress.filter(p => p.learnerId === learner.id);
          let suspiciousCount = this.countSuspiciousKcs(learnerKcProgress);
          let satisfiedCount = learnerKcProgress.filter(p => p.statistics.isSatisfied).length;
          this.progresses.push({
            learner,
            knowledgeComponentProgress: learnerKcProgress,
            kcCount: learnerKcProgress.length,
            satisfiedCount: satisfiedCount,
            suspiciousCount: suspiciousCount,
            performance: this.estimatePerformance(suspiciousCount, learnerKcProgress.length - satisfiedCount, learner.index)
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

      if (!p.statistics.isSatisfied) return;
      if (p.activeSessionInMinutes >= kc.expectedDurationInMinutes && averageSubmissionCount < 6.6) return;
      if (p.activeSessionInMinutes >= kc.expectedDurationInMinutes * 0.75 && averageSubmissionCount < 2.5) return;
      if (p.activeSessionInMinutes >= kc.expectedDurationInMinutes * 0.35 && averageSubmissionCount < 1.75) return;
      suspiciousNum++;
      p.isSuspicious = true;
    });
    return suspiciousNum;
  }

  public estimatePerformance(suspiciousCount: number, unsatisfiedCount: number, index: string): string {
    if(unsatisfiedCount > 0) {
      return 'poor';
    }
    if(index.includes('RA-') && suspiciousCount > 1) {
      return 'consult';
    }
    return 'ok';
  }

  public downloadProgress (groupName: string): void {
    let progresses: {
      username: string;
      name: string;
      count: number;
      suspicious: number;
      satisfied: number; }[] = []

    this.progresses.forEach(learner => {
      const progress = {
        username: learner.learner.index,
        name: learner.learner.name,
        count: learner.kcCount,
        suspicious: learner.suspiciousCount,
        satisfied: learner.satisfiedCount
      }
      progresses.push(progress)
    })

    let unitProgresses = {
      unitName: this.unit.name,
      groupName: groupName,
      progress: progresses
    }

    const blob = new Blob([JSON.stringify(unitProgresses)], {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(blob, groupName + "-" + this.unit.name + ".txt");
  }
}
