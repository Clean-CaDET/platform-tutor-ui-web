import { Component, OnInit } from '@angular/core';
import { LearningObjectComponent } from '../learning-object-component';
import { Question } from './model/question.model';

@Component({
  selector: 'cc-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit, LearningObjectComponent {

  data: Question;

  constructor() { }

  ngOnInit(): void {
  }
}
