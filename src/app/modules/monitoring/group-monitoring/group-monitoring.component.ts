import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Group } from '../model/group.model';
import { GroupMonitoringService } from './group-monitoring.service';
import { Learner } from '../model/learner.model';
import { TaskProgress } from '../grading/model/task-progress';
import { WeeklyFeedbackService } from '../weekly-feedback/weekly-feedback.service';

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

  feedbackDate: Date;

  constructor(private route: ActivatedRoute, private groupMonitoringService: GroupMonitoringService, private feedbackService: WeeklyFeedbackService) { }

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
        if(this.feedbackDate && this.mode === 'progress') this.getGroupFeedback(this.feedbackDate);
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

  public getGroupFeedback(date: Date) {
    this.feedbackDate = date;
    this.feedbackService.getByGroup(this.courseId, this.learners.map(l => l.id), date)
      .subscribe(feedback => this.learners.forEach(l => {
        const relatedFeedback = feedback.find(f => f.learnerId === l.id);
        if(!relatedFeedback) {
          l.semaphore = 0;
          l.semaphoreJustification = '';
          return;
        }
        l.semaphore = relatedFeedback.semaphore;
        l.semaphoreJustification = relatedFeedback.semaphoreJustification;
      }));
  }
}
