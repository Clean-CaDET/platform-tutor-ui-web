import { Component } from '@angular/core';
import { LearningTask } from '../model/learning-task';

@Component({
  selector: 'cc-learning-task',
  templateUrl: './learning-task.component.html',
  styleUrls: ['./learning-task.component.scss']
})
export class LearningTaskComponent {
  task: LearningTask;
  taskDescription: string;

  editMode: false;
  activities: any[];

  constructor() {
    this.task = {
      id: 1,
      unitId: 1,
      isTemplate: true,
      name: "Razvoj složene funkcionalnosti",
      steps: [
        {
          id: 1,
          order: 1,
          activityId: 1,
          activityName: "Dizajniranje strukture i ponašanja agregata"
        },
        {
          id: 2,
          order: 2,
          activityId: 2,
          activityName: "Implementacija agregata"
        },
        {
          id: 3,
          order: 3,
          activityId: 3,
          activityName: "Testiranje agregata"
        }
      ]
    };

    this.activities = [
      {
        id: 1,
        courseId: 1,
        code: "AgregatD",
        name: "Dizajniranje strukture i ponašanja agregata"
      },
      {
        id: 2,
        courseId: 1,
        code: "AgregatI",
        name: "Implementacija agregata"
      },
      {
        id: 3,
        courseId: 1,
        code: "AgregatT",
        name: "Testiranje agregata"
      }
    ]
  }

  updateDescription(description: string) {
    this.taskDescription = description;
  }
}
