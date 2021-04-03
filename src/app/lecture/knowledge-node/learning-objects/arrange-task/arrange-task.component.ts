import { Component, OnInit } from '@angular/core';
import { LearningObjectComponent } from '../learning-object-component';
import { ArrangeTask } from './model/arrange-task.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ArrangeTaskService } from './service/arrange-task.service';
import { Container } from './model/container.model';
import { Element } from './model/element.model';
import { ActivatedRoute } from '@angular/router';

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

  resetState(): void {
    this.state = [];
    this.learningObject.containers.forEach(container => {
      container.elements = [];
      this.state.push(container);
    });
    this.state[0].elements = [...this.learningObject.unarrangedElements];
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
      console.log(this.feedbackMap);
      this.answered = true;
    });
  }

}
