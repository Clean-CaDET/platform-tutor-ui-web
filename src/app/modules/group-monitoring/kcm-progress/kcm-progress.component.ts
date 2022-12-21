import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { LearnerGroup } from '../../learning/learner/learner-group.model';
import { Unit } from '../../learning/unit/unit.model';
import { GroupMonitoringService } from '../group-monitoring.service';
import {LearnerProgress} from '../model/learner-progress';
import {Course} from '../../learning/course/course.model';

@Component({
  selector: 'cc-kcm-progress',
  templateUrl: './kcm-progress.component.html',
  styleUrls: ['./kcm-progress.component.scss'],
})
export class KcmProgressComponent implements OnInit {
  progress: LearnerProgress[] = [];
  count: number;
  page = 1;
  pageSize = 16;

  groupId = 0;
  groups: LearnerGroup[];

  courseId = 0;
  course: Course;
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
      this.getCourse();
    });
  }

  private getLearnerGroups() {
    this.groupMonitoringService.getGroups(this.courseId).subscribe((groups) => {
      this.groups = groups;
      this.groupId = this.groups[0].id;
      this.getLearnerProgress();
    });
  }

  private getCourse() {
    this.groupMonitoringService
      .getCourse(this.courseId)
      .subscribe((course) => {
        this.course = course;
        this.units = course.knowledgeUnits;
        this.unitId = this.units[0].id;
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
}
