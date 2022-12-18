import {
  Component,
  Input,
  OnChanges
} from '@angular/core';

@Component({
  selector: 'cc-learner-progress',
  templateUrl: './learner-progress.component.html',
  styleUrls: ['./learner-progress.component.scss'],
})
export class LearnerProgressComponent implements OnChanges {
  @Input() unitId = 0;
  @Input() learnerProgress: any = [];

  kcNum = 0;
  satisfiedNum = 0;
  suspiciousNum = 0;

  constructor() {}

  ngOnChanges(): void {
    this.countProgress();
  }

  countProgress(): void {
    this.kcNum = this.countKc();
    this.satisfiedNum = this.countSatisfiedKc();
    this.suspiciousNum = this.countSuspiciousKcs();
  }

  countKc() {
    return this.learnerProgress.knowledgeComponentProgress.filter(
      (p) => p.kcUnitId === this.unitId
    ).length;
  }

  countSatisfiedKc() {
    return this.learnerProgress.knowledgeComponentProgress.filter(
      (p) => p.kcUnitId === this.unitId && p.statistics.isSatisfied
    ).length;
  }

  countSuspiciousKcs() {
    let suspiciousKcs = 0;
    const progressFiltered =
      this.learnerProgress.knowledgeComponentProgress.filter(
        (p) => p.kcUnitId === this.unitId
      );
    progressFiltered.forEach((pf) => {
      if (
        pf.expectedDurationInMinutes > pf.durationOfFinishedSessionsInMinutes &&
        pf.statistics.isSatisfied === true
      ) {
        suspiciousKcs++;
      }
    });
    return suspiciousKcs;
  }
}
