import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Unit} from '../../learning/model/unit.model';
import {Course} from '../../learning/model/course.model';
import {LearnerGroup} from '../../learning/model/learner-group.model';
import {GroupMonitoringService} from './group-monitoring.service';
import {LegacyPageEvent as PageEvent} from '@angular/material/legacy-paginator';
import {Learner} from '../../knowledge-analytics/model/learner.model';
import {LearnerProgressComponent} from "./learner-progress/learner-progress.component";

@Component({
  selector: 'cc-group-monitoring',
  templateUrl: './group-monitoring.component.html',
  styleUrls: ['./group-monitoring.component.scss'],
})
export class GroupMonitoringComponent implements OnInit {

  @ViewChild(LearnerProgressComponent) learnerProgress: LearnerProgressComponent

  courseId = 0;
  course: Course;

  selectedUnit: Unit;
  units: Unit[];

  selectedGroupId = 0;
  groups: LearnerGroup[];

  learners: Learner[] = [];
  count: number;
  pageIndex = 0;
  pageSize = 20;

  showProgress = true;

  constructor(private route: ActivatedRoute, private groupMonitoringService: GroupMonitoringService) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.courseId = +params.courseId;
      this.selectedUnit = null;
      this.getLearnerGroups();
      this.getCourse();
    });
  }

  private getLearnerGroups(): void {
    this.groupMonitoringService.getGroups(this.courseId).subscribe((groupsPage) => {
      this.groups = groupsPage.results;
      this.selectedGroupId = this.groups[0].id;
      this.getLearners();
    });
  }

  private getCourse(): void {
    this.groupMonitoringService.getCourse(this.courseId).subscribe((course) => {
      this.course = course;
      this.units = course.knowledgeUnits.sort((a, b) => a.order - b.order);
    });
  }

  public getLearners(): void {
    this.groupMonitoringService.getLearners(this.pageIndex+1, this.pageSize, +this.selectedGroupId, +this.courseId)
      .subscribe((data) => {
        this.learners = data.results;
        this.count = data.totalCount;
      });
  }

  changePage(paginator: PageEvent): void {
    if(this.pageSize !== paginator.pageSize) {
      this.pageIndex = 0;
    } else {
      this.pageIndex = paginator.pageIndex;
    }
    this.pageSize = paginator.pageSize;
    this.getLearners();
  }

  downloadProgress(): void {
    let groupName = this.groups.find((g: LearnerGroup) => g.id === this.selectedGroupId)?.name || "SVE" ;
    this.learnerProgress.downloadProgress(groupName);
  }
}
