import { Component, OnInit } from '@angular/core';
import { LearningObjectComponent } from '../learning-object-component';
import { Question } from './model/question.model';
import { QuestionService } from './service/question.service';

@Component({
  selector: 'cc-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit, LearningObjectComponent {

  data: Question;
  answers: number[];
  answered = false;

  constructor(private questionService: QuestionService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.questionService.answerQuestion(this.data.id, this.answers).subscribe(data => {
      // TODO: Do something with the response data
      this.answered = true;
    });
  }
}
