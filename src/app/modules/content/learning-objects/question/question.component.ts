import {Component, OnInit} from '@angular/core';
import {LearningObjectComponent} from '../learning-object-component';
import {Question} from './model/question.model';
import {QuestionService} from './question.service';
import {ActivatedRoute} from '@angular/router';
import {MrqItem} from './model/answer.model';
import {shuffleArray} from '../../../../shared/helpers/arrays';
import {Result} from './model/result';

@Component({
  selector: 'cc-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit, LearningObjectComponent {

  learningObject: Question;
  checked: boolean[];
  answered = false;
  results: Result[];

  constructor(private questionService: QuestionService, private route: ActivatedRoute) {
    this.checked = [];
  }

  ngOnInit(): void {
    this.learningObject.items = shuffleArray(this.learningObject.items);
  }

  get nodeId(): number {
    return +this.route.snapshot.paramMap.get('nodeId');
  }

  get checkedAnswers(): MrqItem[] {
    const checkedAnswers = [];
    for (let i = 0; i < this.checked.length; i++) {
      if (this.checked[i]) {
        checkedAnswers.push(this.learningObject.items[i]);
      }
    }
    return checkedAnswers;
  }

  onSubmit(): void {
    this.questionService.answerQuestion(this.nodeId, this.learningObject.id, this.checkedAnswers).subscribe(mrqEvaluation => {
      this.results = [];
      mrqEvaluation.itemEvaluations.forEach(mrqItemEvaluation => {
        this.results.push(new Result(mrqItemEvaluation));
      });
      this.answered = true;
    });
  }

  getAnswerResult(answerId: number): Result {
    return this.results.find(result => result.id === answerId);
  }
}
