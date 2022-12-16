import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'cc-learner-progress',
  templateUrl: './learner-progress.component.html',
  styleUrls: ['./learner-progress.component.scss'],
})
export class LearnerProgressComponent implements OnChanges {
  @Input() unitId: number = 0;
  @Input() learnerProgress: any = [];

  kcNum: number = 0;
  satisfiedNum: number = 0;
  suspiciousNum: number = 0;

  constructor() {}

  ngOnChanges() {
    this.countProgress();
  }

  countProgress() {
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
