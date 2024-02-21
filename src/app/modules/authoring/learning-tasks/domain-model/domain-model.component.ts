import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { LearningTasksService } from '../learning-tasks-authoring.service';

@Component({
  selector: 'cc-domain-model',
  templateUrl: './domain-model.component.html',
  styleUrls: ['./domain-model.component.scss']
})
export class DomainModelComponent implements OnInit {

  learningTask: any;
  domainModel: string;
  courseId: number;
  unitId: number;
  editMode: boolean = false;

  constructor(private route: ActivatedRoute, private learningTasksService: LearningTasksService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.courseId = +params.courseId;
      this.unitId = +params.unitId;
      this.learningTasksService.get(this.unitId, +params.ltId).subscribe(learningTask => {
        if(!learningTask.domainModel || learningTask.domainModel.description == '') {
          learningTask.domainModel = {};
          this.editMode = true;
        }
        this.learningTask = learningTask;
        this.domainModel = this.learningTask.domainModel.description;
      });
    });
  }

  save() {
    this.learningTask.domainModel.description = this.domainModel;
    this.learningTasksService.update(this.unitId, this.learningTask).subscribe(learningTask => {
      this.learningTask = learningTask;
      this.domainModel = this.learningTask.domainModel.description; 
      this.editMode = false;
      if(this.domainModel == '') {
        this.editMode = true;
      }
    });
  }

  discard() {
    this.domainModel = this.learningTask.domainModel.description;
    this.editMode = false;
  }
}
