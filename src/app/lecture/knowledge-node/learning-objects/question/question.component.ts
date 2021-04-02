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

  learningObject: Question;
  checked: boolean[];
  answered = false;

  constructor(private questionService: QuestionService) {
    this.checked = [];
  }

  ngOnInit(): void {
  }

  get checkedAnswerIds(): number[] {
    const checkedAnswerIds = [];
    for (let i = 0; i < this.checked.length; i++) {
      if (this.checked[i]) {
        checkedAnswerIds.push(this.learningObject.possibleAnswers[i].id);
      }
    }
    return checkedAnswerIds;
  }

  onSubmit(): void {
    this.questionService.answerQuestion(this.learningObject.id, this.checkedAnswerIds).subscribe(data => {
      // TODO: Do something with the response data
      this.answered = true;
    });
  }
}
