import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Group } from '../model/group.model';
import { GroupMonitoringService } from './group-monitoring.service';
import { Learner } from '../model/learner.model';
import { Unit } from '../model/unit.model';

@Component({
  selector: 'cc-group-monitoring',
  templateUrl: './group-monitoring.component.html',
  styleUrls: ['./group-monitoring.component.scss'],
})
export class GroupMonitoringComponent implements OnInit {
  mode: string;
  courseId: number;
  units: Unit[];

  groups: Group[];
  selectedGroupId = 0;
  learners: Learner[] = [];
  selectedLearner: Learner;

  constructor(private route: ActivatedRoute, private groupMonitoringService: GroupMonitoringService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.mode = params.mode;
      if (this.courseId === +params.courseId) return;
      this.courseId = +params.courseId;
      this.getLearnerGroups();
      this.getCourse();
    });
  }

  private getLearnerGroups(): void {
    this.selectedGroupId = 0;
    this.learners = null;
    this.groupMonitoringService.getGroups(this.courseId).subscribe((groupsPage) => {
      this.groups = groupsPage.results;
      this.selectedGroupId = this.groups[0].id; // TODO
      if (this.selectedGroupId) this.getLearners();
    });
  }

  private getCourse(): void {
    this.groupMonitoringService.getUnits(this.courseId).subscribe(course =>
      this.units = course.knowledgeUnits.sort((a, b) => a.order - b.order));
  }

  public getLearners(): void {
    this.groupMonitoringService.getLearners(1, 1, this.selectedGroupId, this.courseId)
      .subscribe((data) => {
        this.selectedLearner = null;
        this.learners = data.results.sort((l1, l2) => l1.name > l2.name ? 1 : -1);
        this.selectedLearner = this.learners[0];
      });
  }

  public changeLearner(learnerId: number) {
    this.selectedLearner = this.learners.find(learner => learner.id === learnerId);
  }

}
