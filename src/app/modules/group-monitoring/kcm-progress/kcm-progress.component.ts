import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Unit } from '../../learning/model/unit.model';
import { LearnerProgress } from '../model/learner-progress';
import { Course } from '../../learning/model/course.model';
import { LearnerGroup } from '../../learning/model/learner-group.model';
import { GroupMonitoringService } from './group-monitoring.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

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

  private getLearnerGroups(): void {
    this.groupMonitoringService.getGroups(this.courseId).subscribe((groups) => {
      this.groups = groups;
      this.groupId = this.groups[0].id;
      this.getLearnerProgress();
    });
  }

  private getCourse(): void {
    this.groupMonitoringService.getCourse(this.courseId).subscribe((course) => {
      this.course = course;
      this.units = course.knowledgeUnits;
      this.unitId = this.units[0].id;
    });
  }

  public getLearnerProgress(): void {
    this.groupMonitoringService
      .getLearners(this.page, this.pageSize, +this.groupId, +this.courseId)
      .subscribe((data) => {
        this.progress = data.results;
        this.count = data.totalCount;
      });
  }

  changePage(paginator: PageEvent): void {
    this.page = paginator.pageIndex + 1;
    this.pageSize = paginator.pageSize;
    this.getLearnerProgress();
  }
}
