import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Group } from '../model/group.model';
import { GroupMonitoringService } from './group-monitoring.service';
import { Learner } from '../model/learner.model';
import { TaskProgress } from '../grading/model/task-progress';

@Component({
  selector: 'cc-group-monitoring',
  templateUrl: './group-monitoring.component.html',
  styleUrls: ['./group-monitoring.component.scss'],
})
export class GroupMonitoringComponent implements OnInit {
  mode: string;
  courseId: number;

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

  public getLearners(): void {
    this.groupMonitoringService.getLearners(this.selectedGroupId, this.courseId)
      .subscribe((data) => {
        this.selectedLearner = null;
        this.learners = data.results.sort((l1, l2) => l1.name > l2.name ? 1 : -1);
        this.selectedLearner = this.learners[0];
      });
  }

  public changeLearner(learnerId: number) {
    this.selectedLearner = this.learners.find(learner => learner.id === learnerId);
  }

  public getTaskSummaries(taskProgress: TaskProgress[]) {
    this.learners.forEach(l => {
      l.completedTaskCount = taskProgress.filter(p => p.learnerId === l.id && p.status === 'Completed').length;
      l.completedStepCount = taskProgress.filter(p => p.learnerId === l.id).flatMap(p => p.stepProgresses).filter(p => p.status === 'Answered').length;
    });
  }
}
