import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LearningTaskFormComponent } from '../learning-task-form/learning-task-form.component';
import { StepFormComponent } from '../step-form/step-form.component';
import { CourseStructureService } from '../../course-structure/course-structure.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'cc-learning-task-tree',
  templateUrl: './learning-task-tree.component.html',
  styleUrls: ['./learning-task-tree.component.scss']
})
export class LearningTaskTreeComponent implements OnInit {

  @Input() learningTask: any;
  @Output() learningTaskUpdated = new EventEmitter<any>();
  @Output() learningTaskDeleted = new EventEmitter<number>();
  activityOptions: any;
  courseId: number;

  constructor(private route: ActivatedRoute, private courseService: CourseStructureService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.learningTask.isExpanded = false;
    this.route.params.subscribe((params: Params) => {
      this.courseId = +params.courseId;
      this.courseService.getCourseActivities(this.courseId).subscribe(activities => {
        this.activityOptions = activities;
      });
    });
  }

  edit() {
    const dialogRef = this.dialog.open(LearningTaskFormComponent, {
      data: {
        learningTask: this.learningTask
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      result.id = this.learningTask.id,
      result.domainModel = this.learningTask.domainModel;
      result.caseStudies = this.learningTask.caseStudies;
      result.steps = this.learningTask.steps;
      result.maxPoints = this.learningTask.maxPoints;
      this.learningTaskUpdated.emit(result);
    });
  }

  delete() {
    this.learningTaskDeleted.emit(this.learningTask.id);
  }

  addStep() {
    const dialogRef = this.dialog.open(StepFormComponent, {
      data: {
        order: this.learningTask.steps.length + 1,
        activityOptions: this.activityOptions,
        isTemplate: this.learningTask.isTemplate
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.learningTask.steps.push(result);
      this.learningTask.steps.sort((s1: { order: number; }, s2: { order: number; }) => s1.order - s2.order);
      this.learningTaskUpdated.emit(this.learningTask);
    });
  }

  editStep(selectedStep: any) {
    const dialogRef = this.dialog.open(StepFormComponent, {
      data: {
        step: selectedStep,
        activityOptions: this.activityOptions,
        isTemplate: this.learningTask.isTemplate
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      let step = this.learningTask.steps.find((u: { id: any; }) => u.id === selectedStep.id);
      step.order = result.order;
      step.activityId = result.activityId;
      step.activityName = result.activityName;
      step.submissionFormat = result.submissionFormat;
      step.standards = result.standards;
      this.learningTask.steps.sort((s1: { order: number; }, s2: { order: number; }) => s1.order - s2.order);
      this.learningTaskUpdated.emit(this.learningTask);
    });
  }

  deleteStep(index: number) {
    this.learningTask.steps.splice(index, 1);
    this.reorderSteps();
    this.learningTaskUpdated.emit(this.learningTask);
  }

  reorderSteps() {
    const mappedSteps = this.learningTask.steps.map((step: { order: any; }, i: number) => {
      step.order = i + 1;
      return step;
    });
    this.learningTask.steps = mappedSteps;
    this.learningTask.steps.sort((s1: { order: number; }, s2: { order: number; }) => s1.order - s2.order);
  }
}
