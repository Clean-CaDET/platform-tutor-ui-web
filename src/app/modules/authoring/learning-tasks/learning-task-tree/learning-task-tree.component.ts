import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LearningTaskFormComponent } from '../learning-task-form/learning-task-form.component';

@Component({
  selector: 'cc-learning-task-tree',
  templateUrl: './learning-task-tree.component.html',
  styleUrls: ['./learning-task-tree.component.scss']
})
export class LearningTaskTreeComponent implements OnInit {

  @Input() learningTask: any;
  @Output() learningTaskSaved = new EventEmitter<any>();

  constructor(private dialog: MatDialog) { }

  ngOnInit() : void{
    this.learningTask.isExpanded = false;
  }

  edit() {
    const dialogRef = this.dialog.open(LearningTaskFormComponent, {
      data: {
        learningTask: this.learningTask
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      result.id = this.learningTask.id,
      result.domainModel = this.learningTask.domainModel;
      result.caseStudies = this.learningTask.caseStudies;
      result.steps = this.learningTask.steps;
      result.maxPoints = this.learningTask.maxPoints;
      this.learningTaskSaved.emit(result);
    });
  }  
}
