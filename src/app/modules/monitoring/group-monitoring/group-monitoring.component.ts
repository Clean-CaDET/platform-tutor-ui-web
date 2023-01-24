import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Unit } from '../../learning/model/unit.model';
import { Course } from '../../learning/model/course.model';
import { LearnerGroup } from '../../learning/model/learner-group.model';
import { GroupMonitoringService } from './group-monitoring.service';
import { PageEvent } from '@angular/material/paginator';
import { KnowledgeComponent } from '../../learning/model/knowledge-component.model';
import { Learner } from '../../knowledge-analytics/model/learner.model';

@Component({
  selector: 'cc-group-monitoring',
  templateUrl: './group-monitoring.component.html',
  styleUrls: ['./group-monitoring.component.scss'],
})
export class GroupMonitoringComponent implements OnInit {
  courseId = 0;
  course: Course;

  selectedUnitId = 0;
  units: Unit[];

  selectedGroupId = 0;
  groups: LearnerGroup[];

  learners: Learner[] = [];
  count: number;
  page = 1;
  pageSize = 20;

  constructor(private route: ActivatedRoute, private groupMonitoringService: GroupMonitoringService) {}

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
      this.selectedGroupId = this.groups[0].id;
      this.getLearners();
    });
  }

  private getCourse(): void {
    this.groupMonitoringService.getCourse(this.courseId).subscribe((course) => {
      this.course = course;
      this.units = course.knowledgeUnits;
    });
  }

  public getLearners(): void {
    this.groupMonitoringService.getLearners(this.page, this.pageSize, +this.selectedGroupId, +this.courseId)
      .subscribe((data) => {
        this.learners = data.results;
        this.count = data.totalCount;
      });
  }

  changePage(paginator: PageEvent): void {
    this.page = paginator.pageIndex + 1;
    this.pageSize = paginator.pageSize;
    this.getLearners();
  }
}
