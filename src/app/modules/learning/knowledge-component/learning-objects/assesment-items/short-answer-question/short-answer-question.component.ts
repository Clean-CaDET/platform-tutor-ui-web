import { Component } from '@angular/core';
import { ShortAnswerQuestion } from './short-answer-question.model';
import { LearningObjectComponent } from '../../learning-object-component';
import { InterfacingInstructor } from 'src/app/modules/learning-utilities/interfacing-instructor.service';
import { SaqEvaluation } from 'src/app/modules/learning/model/learning-objects/short-answer-question/saq-evaluation.model';
import { SaqSubmission } from 'src/app/modules/learning/model/learning-objects/short-answer-question/saq-submission.model';
import { submissionTypes } from 'src/app/modules/learning/model/learning-objects/submission.model';
import { SubmissionService } from '../../../submission.service';

@Component({
  selector: 'cc-short-answer-question',
  templateUrl: './short-answer-question.component.html',
  styleUrls: ['./short-answer-question.component.scss'],
})
export class ShortAnswerQuestionComponent implements LearningObjectComponent {
  learningObject: ShortAnswerQuestion;
  response: SaqEvaluation;
  answer: string;

  constructor(
    private submissionService: SubmissionService,
    private instructor: InterfacingInstructor
  ) {}

  onSubmit(): void {
    const submission: SaqSubmission = {
      typeDiscriminator: submissionTypes.shortAnswerQuestion,
      answer: this.answer,
    };
    this.submissionService
      .submit(this.learningObject.id, submission)
      .subscribe((evaluation) => {
        this.instructor.submit(evaluation.correctnessLevel);
        this.response = evaluation as SaqEvaluation;
      });
  }
}
