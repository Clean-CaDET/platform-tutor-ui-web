import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task/task.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'cc-learning-task-list',
  templateUrl: './learning-task-list.component.html',
  styleUrls: ['./learning-task-list.component.scss']
})
export class LearningTaskListComponent implements OnInit {

  learningTasks: any[];

  constructor(private taskService: TaskService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.taskService.getByUnit(+params.unitId).subscribe(learningTasks => {
        this.learningTasks = learningTasks;
      });
    });
  }
}
