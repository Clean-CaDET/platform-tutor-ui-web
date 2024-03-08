import { Component, OnDestroy, OnInit } from '@angular/core';
import { LearningTask } from '../model/learning-task';
import { ActivatedRoute, Params } from '@angular/router';
import { LearningTasksService } from '../learning-tasks-authoring.service';
import { Subscription } from 'rxjs';
import { Activity } from '../model/activity';

@Component({
  selector: 'cc-learning-task',
  templateUrl: './learning-task.component.html',
  styleUrls: ['./learning-task.component.scss']
})
export class LearningTaskComponent implements OnInit, OnDestroy {
  courseId: number;
  routeSubscription: Subscription;
  
  task: LearningTask;
  mode: string = 'task';
  selectedStep: Activity;

  constructor(private taskService: LearningTasksService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params: Params) => {
      this.courseId = +params.courseId;
      this.taskService.get(+params.unitId, +params.ltId).subscribe(task => {
        this.task = task;
      });
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  openTask(): void {
    this.mode = 'task';
    this.selectedStep = null;
  }

  addStep(): void {
    this.selectedStep = {
      name: '',
      code: '',
      guidance: '',
      order: this.getOrder(),
      submissionFormat: {guidelines: '', validationRule: ''},
      examples: [],
      standards: []
    };
    this.mode = 'guidance';
    // TODO: Open activity details with new empty activity.
  }

  getOrder(): number {
    if(!this.task.steps?.length) return 1;
    return Math.max(...this.task.steps.map(s => s.order)) + 1;
  }

  showStep(id: number, guidance: boolean): void {
    // TODO: Open activity details with activity.
  }

  deleteStep(id: number): void {
    // TODO: Delete activity with modal confirm.
  }
}
