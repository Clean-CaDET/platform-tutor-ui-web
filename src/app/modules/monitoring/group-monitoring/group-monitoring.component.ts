import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Group } from '../model/group.model';
import { GroupMonitoringService } from './group-monitoring.service';
import { Learner } from '../model/learner.model';
import { TaskProgress } from '../grading/model/task-progress';
import { WeeklyFeedbackService } from '../weekly-feedback/weekly-feedback.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { WeeklyFeedback } from '../weekly-feedback/weekly-feedback.model';

@Component({
  selector: 'cc-group-monitoring',
  templateUrl: './group-monitoring.component.html',
  styleUrls: ['./group-monitoring.component.scss'],
})
export class GroupMonitoringComponent implements OnInit {
  mode: 'enrollments'|'grading'|'progress';
  courseId: number;

  groups: Group[] = [];
  selectedGroupId = 0;
  learners: Learner[] = [];
  selectedLearner: Learner;

  selectedDate: Date;

  constructor(private route: ActivatedRoute, private groupMonitoringService: GroupMonitoringService, private feedbackService: WeeklyFeedbackService) { }

  ngOnInit(): void {
    this.selectedDate = new Date();
    this.route.params.subscribe((params: Params) => {
      this.mode = params.mode;
      if (this.courseId === +params.courseId) {
        this.getGroupFeedback();
        return;
      }
      this.courseId = +params.courseId;
      this.getLearnerGroups();
    });
    this.feedbackService.weeklyFeedbackObserver.subscribe(feedback => {
      this.setSemaphore(this.selectedLearner, feedback);
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
        this.getGroupFeedback();
      });
  }

  public getGroupFeedback() {
    if(!this.selectedDate || this.mode !== 'progress') return;

    this.feedbackService.getByGroup(this.courseId, this.learners.map(l => l.id), this.selectedDate)
      .subscribe(feedback => this.learners.forEach(l => {
        const relatedFeedback = feedback.find(f => f.learnerId === l.id);
        this.setSemaphore(l, relatedFeedback);
      }));
  }

  private setSemaphore(learner: Learner, feedback: WeeklyFeedback) {
    if(!feedback) {
      learner.semaphore = 0;
      learner.semaphoreJustification = '';
      return;
    }
    learner.semaphore = feedback.semaphore;
    learner.semaphoreJustification = feedback.semaphoreJustification;
  }

  public getTaskSummaries(taskProgress: TaskProgress[]) {
    this.learners.forEach(l => {
      l.completedTaskCount = taskProgress.filter(p => p.learnerId === l.id && p.status === 'Completed').length;
      l.completedStepCount = taskProgress.filter(p => p.learnerId === l.id).flatMap(p => p.stepProgresses).filter(p => p.status === 'Answered').length;
    });
  }

  public onDateChange(event: MatDatepickerInputEvent<Date>) {
    if(!event?.value) return;
    this.selectedDate = event.value;
    this.getGroupFeedback();
  }

  public changeLearner(learnerId: number) {
    this.selectedLearner = this.learners.find(learner => learner.id === learnerId);
  }
}
