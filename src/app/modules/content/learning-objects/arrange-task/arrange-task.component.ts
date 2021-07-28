import { Component, OnInit } from '@angular/core';
import { LearningObjectComponent } from '../learning-object-component';
import { ArrangeTask } from './model/arrange-task.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ArrangeTaskService } from './arrange-task.service';
import { Container } from './model/container.model';
import { Element } from './model/element.model';
import { ActivatedRoute } from '@angular/router';
import { shuffleArray } from '../../../../shared/helpers/arrays';

interface ArrangeTaskFeedback {
  id: number;
  submissionWasCorrect: boolean;
  correctElements: Element[];
}

@Component({
  selector: 'cc-arrange-task',
  templateUrl: './arrange-task.component.html',
  styleUrls: ['./arrange-task.component.css']
})
export class ArrangeTaskComponent implements OnInit, LearningObjectComponent {

  learningObject: ArrangeTask;
  state: Container[];
  feedbackMap: Map<number, ArrangeTaskFeedback>;
  answered = false;

  constructor(private arrangeTaskService: ArrangeTaskService, private route: ActivatedRoute) {
    this.feedbackMap = new Map();
  }

  ngOnInit(): void {
    this.resetState();
  }

  get nodeId(): number {
    return +this.route.snapshot.paramMap.get('nodeId');
  }

  private isElementCorrect(elementId: number, containerId: number): boolean {
    return this.feedbackMap
      .get(containerId).correctElements
      .map(element => element.id).includes(elementId);
  }

  getMissingElements(containerId: number): Element[] {
    const elementIds = this.state.find(container => container.id === containerId)
      .elements.map(element => element.id);
    const missingElements = [];
    this.feedbackMap.get(containerId).correctElements.forEach(element => {
      if (!elementIds.includes(element.id)) {
        missingElements.push(element);
      }
    });
    return missingElements;
  }

  resetState(): void {
    this.state = [];
    this.learningObject.containers.forEach(container => {
      container.elements = [];
      this.state.push(container);
    });
    this.state[0].elements = shuffleArray(this.learningObject.unarrangedElements);
    this.answered = false;
  }

  drop(event: CdkDragDrop<Element[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  onSubmit(): void {
    this.arrangeTaskService.submitTask(this.nodeId, this.learningObject.id, this.state).subscribe(data => {
      data.forEach(feedback => {
        this.feedbackMap.set(feedback.id, feedback);
      });
      this.answered = true;
    });
  }

}
