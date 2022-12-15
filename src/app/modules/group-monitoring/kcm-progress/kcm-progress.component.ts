import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { LearnerGroup } from '../../learning/learner/learner-group.model';
import { Unit } from '../../learning/unit/unit.model';
import { GroupMonitoringService } from '../group-monitoring.service';

@Component({
  selector: 'cc-kcm-progress',
  templateUrl: './kcm-progress.component.html',
  styleUrls: ['./kcm-progress.component.scss'],
})
export class KcmProgressComponent implements OnInit {
  progress: any[];
  count: number;
  page = 1;
  pageSize = 16;

  groupId = 0;
  groups: LearnerGroup[];

  courseId = 0;
  unitId = 0;
  units: Unit[];

  constructor(
    private route: ActivatedRoute,
    private groupMonitoringService: GroupMonitoringService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.courseId = +params.courseId;
      this.getLearnerGroups();
      this.groupMonitoringService
        .getUnitsByCourse(this.courseId)
        .subscribe((units) => {
          this.units = units;
          this.unitId = this.units[0].id;
        });
    });
  }

  private getLearnerGroups() {
    this.groupMonitoringService.getGroups(this.courseId).subscribe((groups) => {
      this.groups = groups;
      this.groupId = this.groups[0].id;
      this.getLearnerProgress();
    });
  }

  public getLearnerProgress() {
    this.groupMonitoringService
      .getLearners(this.page, this.pageSize, +this.groupId, +this.courseId)
      .subscribe((data) => {
        this.progress = data.learnersProgress;
        this.count = data.count;
      });
  }

  changePage(paginator) {
    this.page = paginator.pageIndex + 1;
    this.pageSize = paginator.pageSize;
    this.getLearnerProgress();
  }

  countKc(progress) {
    if (this.unitId == 0) {
      return progress.length;
    }
    return progress.filter((p) => p.kcUnitId === this.unitId).length;
  }

  countSatisfiedKc(progress) {
    if (this.unitId == 0) {
      return progress.filter((p) => p.statistics.isSatisfied).length;
    }
    return progress.filter(
      (p) => p.kcUnitId === this.unitId && p.statistics.isSatisfied
    ).length;
  }

  checkSuspiciousKcs(progress) {
    let suspiciousKcs = 0;
    const progressFiltered = progress.filter((p) => p.kcUnitId === this.unitId);
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
