import { Component, OnInit } from '@angular/core';
import { TaskService } from './task.service';
import { ActivatedRoute, Params } from '@angular/router';
import { TaskProgressService } from './task-progress.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LearningTask } from './model/learning-task';
import { Activity } from './model/activity';
import { ActivityExample } from './model/activity-example';
import { TaskProgress } from './model/task-progress';
import { forkJoin } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { ClipboardButtonComponent } from 'src/app/shared/markdown/clipboard-button/clipboard-button.component';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { trigger, state, animate, style, transition } from '@angular/animations';

@Component({
  selector: 'cc-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  animations: [
    trigger('expandCollapseDefinition', [
      state('collapsed', style({
        height: '95%'
      })),
      state('expanded', style({
        height: '35%'
      })),
      transition('collapsed <=> expanded', [
        animate('0.7s ease-in-out')
      ])
    ]),
    trigger('expandCollapseContent', [
      state('collapsed', style({
        height: '56px'
      })),
      state('expanded', style({
        height: '65%'
      })),
      transition('collapsed <=> expanded', [
        animate('0.7s ease-in-out')
      ])
    ])
  ]
})
export class TaskComponent implements OnInit {
  readonly clipboard = ClipboardButtonComponent;
  isExpanded: boolean = false;
  toggleExpansion() {
    this.isExpanded = true;
    setTimeout(() => this.viewStep(this.steps[0]), 700);
  }
  task: LearningTask;
  steps: Activity[];
  taskProgress: TaskProgress;

  selectedStep: Activity;
  selectedStepIndex: number;
  answerForm: FormGroup;
  selectedExample: ActivityExample;
  videoUrl: string;

  courseId: number;
  selectedTab = new FormControl(0);

  constructor(
    private route: ActivatedRoute,
    private title: Title,
    private builder: FormBuilder,
    private taskService: TaskService,
    private progressService: TaskProgressService,
  ) { }

  ngOnInit() {
    this.setTask();
  }

  public onTabChanged(tabChangeEvent: MatTabChangeEvent): void {
    if(tabChangeEvent.tab.textLabel === "Submisija rešenja") {
      this.progressService.submissionOpened(this.task.unitId, this.task.id, this.taskProgress.id, this.selectedStep.id)
      .subscribe();
    } else if(tabChangeEvent.tab.textLabel === "Smernice") {
      this.progressService.guidanceOpened(this.task.unitId, this.task.id, this.taskProgress.id, this.selectedStep.id)
      .subscribe();
    } else if(tabChangeEvent.tab.textLabel === "Primeri") {
      this.progressService.exampleOpened(this.task.unitId, this.task.id, this.taskProgress.id, this.selectedStep.id)
      .subscribe();
    }
  }

  public onVideoStatusChanged(event: any): void {
    if (event.data === 0) {
      this.progressService.exampleVideoFinished(this.task.unitId, this.task.id, this.taskProgress.id, this.selectedStep.id,
        this.videoUrl
      )
      .subscribe()
    } else if (event.data === 1) {
      this.progressService.exampleVideoPlayed(this.task.unitId, this.task.id, this.taskProgress.id, this.selectedStep.id,
        this.videoUrl
      )
      .subscribe()
    } else if (event.data === 2) {
      this.progressService.exampleVideoPaused(this.task.unitId, this.task.id, this.taskProgress.id, this.selectedStep.id,
        this.videoUrl
      )
      .subscribe()
    }
  }

  public onSubStepVideoStatusChanged(event: any): void {
    if (event.videoStatus === 0) {
      this.progressService.exampleVideoFinished(this.task.unitId, this.task.id, this.taskProgress.id, this.selectedStep.id,
        event.videoUrl
      )
      .subscribe()
    } else if (event.videoStatus === 1) {
      this.progressService.exampleVideoPlayed(this.task.unitId, this.task.id, this.taskProgress.id, this.selectedStep.id,
        event.videoUrl
      )
      .subscribe()
    } else if (event.videoStatus === 2) {
      this.progressService.exampleVideoPaused(this.task.unitId, this.task.id, this.taskProgress.id, this.selectedStep.id,
        event.videoUrl
      )
      .subscribe()
    }
  }

  setTask() {
    this.route.params.subscribe((params: Params) => {
      this.courseId = +params.courseId;
      forkJoin([this.taskService.get(+params.unitId, +params.ltId), this.progressService.get(+params.unitId, +params.ltId)])
        .subscribe(([task, progress]) => {
          this.mapSubactivities(task.steps);
          this.task = task;
          this.title.setTitle("Tutor - " + task.name);
          this.steps = task.steps.filter(s => !s.parentId).sort((a, b) => a.order - b.order); // Check if we need steps
          this.taskProgress = progress;
          this.steps.forEach(step => step.progress = this.taskProgress.stepProgresses.find(p => p.stepId === step.id));
          const suitableStep = this.selectSuitableStep();
          if(suitableStep) {
            this.isExpanded = true;
            this.viewStep(suitableStep);
          }
        });
    });
  }

  private mapSubactivities(activities: Activity[]) {
    for (const activity of activities) {
      activity.subactivities = [];
      for (const subactivity of activities) {
        if (subactivity.parentId === activity.id) {
          activity.subactivities.push(subactivity);
        }
      }
      activity.subactivities.sort((s1, s2) => s1.order - s2.order);
    }
  }

  private selectSuitableStep(): Activity {
    if(!this.steps.length) return null;
    // If no steps were opened, focus the task description
    if(this.taskProgress.stepProgresses.every(p => p.status === 'Initialized')) return null;

    // If one step was viewed, focus first unanswered step
    const firstUnansweredStep = this.steps.find(s => {
      const progress = this.taskProgress.stepProgresses.find(p => p.stepId === s.id);
      return !progress.answer;
    });
    if(firstUnansweredStep) return firstUnansweredStep;

    return this.steps[0];
  }

  viewStep(step: Activity) {
    if(!step) return;
    this.selectedTab.setValue(0);
    this.selectedStep = step;
    this.selectedStepIndex = this.steps.findIndex(s => s.code === step.code);
    this.selectedStep.standards?.sort((a, b) => a.name > b.name ? 1 : -1);
    if(this.selectedStep.examples?.length > 0) {
      this.selectedExample = this.selectedStep.examples[0];
      this.videoUrl = this.selectedExample.url.split('/').pop().slice(-11);
    }
    this.createForm();
    this.progressService.viewStep(this.task.unitId, this.task.id, this.taskProgress.id, step.id)
      .subscribe(progress => {
        this.taskProgress = progress;
        this.progressService.submissionOpened(this.task.unitId, this.task.id, this.taskProgress.id, this.selectedStep.id).subscribe();
      });
  }

  private createForm() {
    const regexPattern: RegExp = new RegExp(this.selectedStep.submissionFormat.validationRule, 's');
    this.answerForm = this.builder.group({
      answer: new FormControl('', [Validators.required, Validators.pattern(regexPattern)])
    });
    this.answerForm.get('answer').setValue(this.selectedStep.progress.answer);
  }

  isAnswered(step: Activity): boolean {
    if (!this.taskProgress.stepProgresses) return false;
    let stepProgress = this.taskProgress.stepProgresses.find(s => s.stepId === step.id);
    return !!stepProgress?.answer;
  }

  submitAnswer() {
    this.selectedStep.progress.answer = this.answerForm.value.answer;
    this.progressService.submitAnswer(this.task.unitId, this.task.id, this.taskProgress.id, this.selectedStep.progress)
      .subscribe(progress => this.taskProgress = progress);
  }

  isGraded(step: Activity) {
    if (!this.taskProgress.stepProgresses) return false;
    let stepProgress = this.taskProgress.stepProgresses.find(s => s.stepId === step.id);
    return !!stepProgress.answer;
  }

  getNextExample() {
    let index = this.selectedStep.examples.indexOf(this.selectedExample);
    if (index != this.selectedStep.examples.length - 1) {
      this.selectedExample = this.selectedStep.examples[index + 1];
    } else {
      this.selectedExample = this.selectedStep.examples[0];
    }
    this.videoUrl = this.selectedExample.url.split('/').pop().slice(-11);
  }

  public getPoints(standardId: number): number {
    let evaluation = this.selectedStep.progress.evaluations.find(e => e.standardId == standardId);
    return evaluation.points;
  }

  public getComment(standardId: number): string {
    let evaluation = this.selectedStep.progress.evaluations.find(e => e.standardId == standardId);
    return evaluation.comment;
  }
}
