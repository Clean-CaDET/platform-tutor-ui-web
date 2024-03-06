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
  mode: string = 'guidance';
  selectedStep: Activity;

  constructor(private taskService: LearningTasksService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params: Params) => {
      this.courseId = +params.courseId;
      this.taskService.get(+params.unitId, +params.ltId).subscribe(task => {
        this.task = task;
        if(this.task.steps?.length > 0 ) this.selectedStep = this.task.steps[0];
      });
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  addStep(): void {
    // TODO: Open activity details with new empty activity.
  }

  showStep(id: number, guidance: boolean): void {
    // TODO: Open activity details with activity.
  }

  deleteStep(id: number): void {
    // TODO: Delete activity with modal confirm.
  }
}
