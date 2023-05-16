import { Component, Input, OnChanges } from '@angular/core';
import {KnowledgeComponentProgress} from '../../model/knowledge-component-progress.model';
import { Learner } from 'src/app/modules/monitoring/model/learner.model';
import { LearnerProgress } from '../../model/learner-progress.model';
import { GroupMonitoringService } from '../group-monitoring.service';
import { Unit } from 'src/app/modules/learning/model/unit.model';
import * as FileSaver from "file-saver";


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

      if (!p.statistics.isSatisfied) return;
      if (p.activeSessionInMinutes >= kc.expectedDurationInMinutes) return;
      if (p.activeSessionInMinutes >= kc.expectedDurationInMinutes * 0.75 && averageSubmissionCount < 2.5) return;
      if (averageSubmissionCount < 1.75) return;
      suspiciousNum++;
    });
    return suspiciousNum;
  }

  public shouldAlert(learnerProgress: LearnerProgress): boolean {
    const unsatisfiedCount = learnerProgress.kcCount - learnerProgress.satisfiedCount;
    return unsatisfiedCount > 0 || learnerProgress.suspiciousCount > 0;
  }

  public getAlertColor(learnerProgress: LearnerProgress): string {
    let unsatisfiedCount = learnerProgress.kcCount - learnerProgress.satisfiedCount
    if(unsatisfiedCount > 1 || learnerProgress.suspiciousCount > 1 ||
      (learnerProgress.suspiciousCount === 1 && unsatisfiedCount === 1)) return 'warn';
    return 'accent';
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
