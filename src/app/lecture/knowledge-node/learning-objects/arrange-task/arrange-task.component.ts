import { Component, OnInit } from '@angular/core';
import { LearningObjectComponent } from '../learning-object-component';
import { ArrangeTask } from './model/arrange-task.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'cc-arrange-task',
  templateUrl: './arrange-task.component.html',
  styleUrls: ['./arrange-task.component.css']
})
export class ArrangeTaskComponent implements OnInit, LearningObjectComponent {

  learningObject: ArrangeTask;
  list1: any[];
  list2: any[];
  list3: any[];

  constructor() {
  }

  ngOnInit(): void {
    this.list1 = this.learningObject.elements;
    this.list2 = [];
    this.list3 = [];
  }

  drop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

}
