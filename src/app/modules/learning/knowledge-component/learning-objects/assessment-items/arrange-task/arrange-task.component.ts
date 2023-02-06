import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { AssessmentFeedbackConnector } from 'src/app/modules/learning/knowledge-component/assessment-feedback-connector.service';
import { ArrangeTaskContainerEvaluation } from 'src/app/modules/learning/model/learning-objects/arrange-task/arrange-task-container-evaluation.model';
import { ArrangeTaskContainerSubmission } from 'src/app/modules/learning/model/learning-objects/arrange-task/arrange-task-container-submission.model';
import { ArrangeTaskEvaluation } from 'src/app/modules/learning/model/learning-objects/arrange-task/arrange-task-evaluation.model';
import { ArrangeTaskSubmission } from 'src/app/modules/learning/model/learning-objects/arrange-task/arrange-task-submission.model';
import { Container } from 'src/app/modules/learning/model/learning-objects/arrange-task/container.model';
import { Element } from 'src/app/modules/learning/model/learning-objects/arrange-task/element.model';
import { submissionTypes } from 'src/app/modules/learning/model/learning-objects/submission.model';
import { shuffleArray } from 'src/app/shared/helpers/arrays';
import { SubmissionService } from '../../../submission.service';
import { LearningObjectComponent } from '../../learning-object-component';
import { ArrangeTask } from './arrange-task.model';

@Component({
  selector: 'cc-arrange-task',
  templateUrl: './arrange-task.component.html',
  styleUrls: ['./arrange-task.component.css'],
})
export class ArrangeTaskComponent implements OnInit, LearningObjectComponent {
  learningObject: ArrangeTask;
  state: Container[];
  feedbackMap: Map<number, ArrangeTaskContainerEvaluation>;
  answered = false;

  constructor(
    private submissionService: SubmissionService,
    private instructor: AssessmentFeedbackConnector
  ) {
    this.feedbackMap = new Map();
  }

  ngOnInit(): void {
    this.resetState();
  }

  isElementCorrect(elementId: number, containerId: number): boolean {
    return this.feedbackMap
      .get(containerId)
      ?.correctElements.map((element) => element.id)
      .includes(elementId);
  }

  getMissingElements(containerId: number): Element[] {
    const elementIds = this.state
      .find((container) => container.id === containerId)
      .elements.map((element) => element.id);
    const missingElements: Element[] = [];
    this.feedbackMap.get(containerId)?.correctElements.forEach((element) => {
      if (!elementIds.includes(element.id)) {
        missingElements.push(element);
      }
    });
    return missingElements;
  }

  resetState(): void {
    this.state = [];
    this.learningObject.containers.forEach((container) => {
      container.elements = [];
      this.state.push(container);
    });
    this.state[0].elements = shuffleArray([
      ...this.learningObject.unarrangedElements,
    ]);
    this.answered = false;
  }

  drop(event: CdkDragDrop<Element[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  onSubmit(): void {
    const submission: ArrangeTaskSubmission = {
      typeDiscriminator: submissionTypes.arrangeTask,
      containers: this.createArrangeTaskContainerSubmissionList(),
      reattemptCount: 0
    };
    this.submissionService
      .submit(this.learningObject.id, submission)
      .subscribe(feedback => {
        this.answered = true;
        this.instructor.sendToFeedback(feedback); //TODO: Needs fixing
        (feedback.evaluation as ArrangeTaskEvaluation).containerEvaluations
          .forEach((arrangeTaskContainerEvaluation) => {
            this.feedbackMap.set(
              arrangeTaskContainerEvaluation.id,
              arrangeTaskContainerEvaluation
            );
          });
      });
  }

  createArrangeTaskContainerSubmissionList(): ArrangeTaskContainerSubmission[] {
    let arrangeTaskContainerSubmissionList: ArrangeTaskContainerSubmission[] =
      [];

    this.state.forEach((container, key) => {
      let arrangeTaskContainerSubmission: ArrangeTaskContainerSubmission = {
        arrangeTaskContainerId: container.id,
        elementIds: [],
      };
      container.elements.forEach((element, keyEl) => {
        arrangeTaskContainerSubmission.elementIds.push(element.id);
      });
      arrangeTaskContainerSubmissionList.push(arrangeTaskContainerSubmission);
    });

    return arrangeTaskContainerSubmissionList;
  }
}
