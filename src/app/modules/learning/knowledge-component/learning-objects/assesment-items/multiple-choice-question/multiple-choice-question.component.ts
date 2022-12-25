import { Component, OnInit } from '@angular/core';
import { InterfacingInstructor } from 'src/app/modules/learning-utilities/interfacing-instructor.service';
import { McqEvaluation } from 'src/app/modules/learning/model/learning-objects/multiple-choice-question/mcq-evaluation.model';
import { McqSubmission } from 'src/app/modules/learning/model/learning-objects/multiple-choice-question/mcq-submission.model';
import { submissionTypes } from 'src/app/modules/learning/model/learning-objects/submission.model';
import { shuffleArray } from 'src/app/shared/helpers/arrays';
import { SubmissionService } from '../../../submission.service';
import { LearningObjectComponent } from '../../learning-object-component';
import { MultipleChoiceQuestion } from './multiple-choice-question.model';

@Component({
  selector: 'cc-multiple-choice-question',
  templateUrl: './multiple-choice-question.component.html',
  styleUrls: ['./multiple-choice-question.component.scss'],
})
export class MultipleChoiceQuestionComponent
  implements OnInit, LearningObjectComponent
{
  learningObject: MultipleChoiceQuestion;
  checked: string;
  evaluation: McqEvaluation;

  constructor(
    private submissionService: SubmissionService,
    private instructor: InterfacingInstructor
  ) {}

  ngOnInit(): void {
    this.learningObject.possibleAnswers = shuffleArray(
      this.learningObject.possibleAnswers
    );
  }

  onSubmit(): void {
    const submission: McqSubmission = {
      typeDiscriminator: submissionTypes.mutlipleChoiceQuestion,
      answer: this.checked,
    };
    this.submissionService
      .submit(this.learningObject.id, submission)
      .subscribe((mcqEvaluation) => {
        this.instructor.submit(mcqEvaluation.correctnessLevel);
        this.evaluation = mcqEvaluation as McqEvaluation;
      });
  }

  checkItemCorrectness(item: string) {
    if (item !== this.checked) return '';
    return this.evaluation.correctnessLevel === 1
      ? 'color-correct'
      : 'color-wrong';
  }
}
