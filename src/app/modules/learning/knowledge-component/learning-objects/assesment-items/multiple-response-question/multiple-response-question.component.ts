import { Component, OnInit } from '@angular/core';
import { MultipleReponseQuestion } from './multiple-response-question.model';
import { QuestionService as MultipleResponseQuestionService } from './multiple-response-question.service';
import { LearningObjectComponent } from '../../learning-object-component';
import { InterfacingInstructor } from 'src/app/modules/learning-utilities/interfacing-instructor.service';
import { shuffleArray } from 'src/app/shared/helpers/arrays';
import { MrqEvaluation } from 'src/app/modules/learning/model/learning-objects/multiple-response-question/mrq-evaluation.model';
import { MrqItem } from 'src/app/modules/learning/model/learning-objects/multiple-response-question/mrq-item.model';
import { MrqItemEvaluation } from 'src/app/modules/learning/model/learning-objects/multiple-response-question/mrq-item-evaluation.model';

@Component({
  selector: 'cc-multiple-response-question',
  templateUrl: './multiple-response-question.component.html',
  styleUrls: ['./multiple-response-question.component.scss'],
})
export class MultipleResponseQuestionComponent
  implements OnInit, LearningObjectComponent
{
  learningObject: MultipleReponseQuestion;
  checked: boolean[];
  evaluation: MrqEvaluation;

  constructor(
    private mrqService: MultipleResponseQuestionService,
    private instructor: InterfacingInstructor
  ) {
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
    this.mrqService
      .answerQuestion(this.learningObject.id, this.checkedAnswers)
      .subscribe((mrqEvaluation) => {
        this.instructor.submit(mrqEvaluation.correctnessLevel);
        this.evaluation = mrqEvaluation;
      });
  }

  getAnswerResult(answerId: number): MrqItemEvaluation {
    return this.evaluation.itemEvaluations.find((item) => item.id === answerId);
  }
}
