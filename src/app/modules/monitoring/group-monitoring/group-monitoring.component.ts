import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Unit} from '../../learning/model/unit.model';
import {Course} from '../../learning/model/course.model';
import {LearnerGroup} from '../model/learner-group.model';
import {GroupMonitoringService} from './group-monitoring.service';
import {Learner} from '../model/learner.model';

@Component({
  selector: 'cc-group-monitoring',
  templateUrl: './group-monitoring.component.html',
  styleUrls: ['./group-monitoring.component.scss'],
})
export class GroupMonitoringComponent implements OnInit {
  mode: string;
  courseId: number;
  units: Unit[];

  groups: LearnerGroup[];
  selectedGroupId = 0;
  learners: Learner[] = [];

  constructor(private route: ActivatedRoute, private groupMonitoringService: GroupMonitoringService) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.mode = params.mode;
      if(this.courseId === +params.courseId) return;
      this.courseId = +params.courseId;
      this.getLearnerGroups();
      this.getCourse();
    });
  }

  private getLearnerGroups(): void {
    this.groupMonitoringService.getGroups(this.courseId).subscribe((groupsPage) => {
      this.groups = groupsPage.results;
      this.selectedGroupId = this.groups[0]?.id;
      if(this.selectedGroupId) this.getLearners();
    });
  }

  private getCourse(): void {
    this.groupMonitoringService.getCourse(this.courseId).subscribe((course) => {
      this.units = course.knowledgeUnits.sort((a, b) => a.order - b.order);
    });
  }

  public getLearners(): void {
    this.groupMonitoringService.getLearners(1, 1, this.selectedGroupId, this.courseId)
      .subscribe((data) => {
        this.learners = data.results.sort((l1, l2) => l1.name > l2.name ? 1 : -1);
      });
  }
}
