import { Component, OnInit } from '@angular/core';
import { MultipleReponseQuestion } from './multiple-response-question.model';
import { LearningObjectComponent } from '../../learning-object-component';
import { InterfacingInstructor } from 'src/app/modules/learning-utilities/interfacing-instructor.service';
import { shuffleArray } from 'src/app/shared/helpers/arrays';
import { MrqEvaluation } from 'src/app/modules/learning/model/learning-objects/multiple-response-question/mrq-evaluation.model';
import { MrqItem } from 'src/app/modules/learning/model/learning-objects/multiple-response-question/mrq-item.model';
import { MrqItemEvaluation } from 'src/app/modules/learning/model/learning-objects/multiple-response-question/mrq-item-evaluation.model';
import { SubmissionService } from '../../../submission.service';
import { MrqSubmission } from 'src/app/modules/learning/model/learning-objects/multiple-response-question/mrq-submission.model';
import { submissionTypes } from 'src/app/modules/learning/model/learning-objects/submission.model';

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
    private submissionService: SubmissionService,
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
    const submission: MrqSubmission = {
      typeDiscriminator: submissionTypes.mutlipleResponseQuestion,
      answers: this.checkedAnswers,
    };
    this.submissionService
      .submit(this.learningObject.id, submission)
      .subscribe((mrqEvaluation) => {
        this.instructor.submit(
          this.learningObject.id,
          mrqEvaluation.correctnessLevel
        );
        this.evaluation = mrqEvaluation as MrqEvaluation;
      });
  }

  getAnswerResult(answerId: number): MrqItemEvaluation {
    return this.evaluation.itemEvaluations.find((item) => item.id === answerId);
  }
}
