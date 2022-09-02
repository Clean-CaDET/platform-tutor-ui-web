import {Component, OnInit} from '@angular/core';
import {LearningObjectComponent} from '../learning-object-component';
import {Question} from './model/multiple-response-question.model';
import {QuestionService as MultipleResponseQuestionService} from './multiple-response-question.service';
import {MrqItem} from './model/answer.model';
import {shuffleArray} from '../../../../shared/helpers/arrays';
import {MrqEvaluation} from './model/mrq-evaluation.model';
import {MrqItemEvaluation} from './model/mrq-item-evaluation.model';
import {InterfacingInstructor} from '../../../instructor/interfacing-instructor.service';

@Component({
  selector: 'cc-multiple-response-question',
  templateUrl: './multiple-response-question.component.html',
  styleUrls: ['./multiple-response-question.component.scss']
})
export class MultipleResponseQuestionComponent implements OnInit, LearningObjectComponent {
  learningObject: Question;
  checked: boolean[];
  evaluation: MrqEvaluation;

  constructor(private mrqService: MultipleResponseQuestionService,
              private instructor: InterfacingInstructor) {
    this.checked = [];
  }

  ngOnInit(): void {
    this.learningObject.items = shuffleArray(this.learningObject.items);
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
    this.mrqService.answerQuestion(this.learningObject.id, this.checkedAnswers)
      .subscribe(mrqEvaluation => {
        this.instructor.submit(mrqEvaluation.correctnessLevel);
        this.evaluation = mrqEvaluation;
      });
  }

  getAnswerResult(answerId: number): MrqItemEvaluation {
    return this.evaluation.itemEvaluations.find(item => item.id === answerId);
  }
}
