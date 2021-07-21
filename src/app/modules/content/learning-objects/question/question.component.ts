import { Component, OnInit } from '@angular/core';
import { LearningObjectComponent } from '../learning-object-component';
import { Question } from './model/question.model';
import { QuestionService } from './question.service';
import { ActivatedRoute } from '@angular/router';
import { Answer } from './model/answer.model';

interface Feedback {
  text: string;
  correct: boolean;
}

@Component({
  selector: 'cc-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit, LearningObjectComponent {

  learningObject: Question;
  checked: boolean[];
  answered = false;
  feedbacks: Feedback[];

  constructor(private questionService: QuestionService, private route: ActivatedRoute) {
    this.checked = [];
  }

  ngOnInit(): void {
  }

  get nodeId(): number {
    return +this.route.snapshot.paramMap.get('nodeId');
  }

  get checkedAnswers(): Answer[] {
    const checkedAnswers = [];
    for (let i = 0; i < this.checked.length; i++) {
      if (this.checked[i]) {
        checkedAnswers.push(this.learningObject.possibleAnswers[i]);
      }
    }
    return checkedAnswers;
  }

  onSubmit(): void {
    this.questionService.answerQuestion(this.nodeId, this.learningObject.id, this.checkedAnswers).subscribe(data => {
      this.feedbacks = data.map(answer => ({ correct: answer.submissionWasCorrect, text: answer.feedback }));
      this.answered = true;
    });
  }
}
