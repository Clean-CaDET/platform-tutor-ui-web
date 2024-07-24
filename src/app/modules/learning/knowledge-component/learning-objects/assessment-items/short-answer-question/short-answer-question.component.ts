import { Component } from '@angular/core';
import { ShortAnswerQuestion } from './short-answer-question.model';
import { LearningObjectComponent } from '../../learning-object-component';
import { AssessmentFeedbackConnector } from 'src/app/modules/learning/knowledge-component/assessment-feedback-connector.service';
import { SaqEvaluation } from 'src/app/modules/learning/model/learning-objects/short-answer-question/saq-evaluation.model';
import { SaqSubmission } from 'src/app/modules/learning/model/learning-objects/short-answer-question/saq-submission.model';
import { submissionTypes } from 'src/app/modules/learning/model/learning-objects/submission.model';
import { SubmissionService } from '../../../submission.service';
import { Subscription } from 'rxjs';
import { feedbackTypes } from 'src/app/modules/learning/model/learning-objects/feedback.model';
import { ClipboardButtonComponent } from 'src/app/shared/markdown/clipboard-button/clipboard-button.component';

@Component({
  selector: 'cc-short-answer-question',
  templateUrl: './short-answer-question.component.html',
  styleUrls: ['./short-answer-question.component.scss'],
})
export class ShortAnswerQuestionComponent implements LearningObjectComponent {
  readonly clipboard = ClipboardButtonComponent;

  learningObject: ShortAnswerQuestion;
  private observedFeedback: Subscription;

  submissionReattemptCount = 0;
  submissionIsProcessing: boolean;
  evaluation: SaqEvaluation;
  answer: string;

  constructor(private submissionService: SubmissionService, private feedbackConnector: AssessmentFeedbackConnector) {}

  ngOnInit(): void {
    this.submissionIsProcessing = false;
    this.observedFeedback = this.feedbackConnector.observedFeedback.subscribe(feedback => {
      this.submissionIsProcessing = false;
      if(feedback.type === feedbackTypes.solution || feedback.type === feedbackTypes.correctness) {
        this.evaluation = feedback.evaluation as SaqEvaluation;
      }
    });
  }

  ngOnDestroy(): void {
    this.observedFeedback?.unsubscribe();
  }

  onSubmit(): void {
    const submission: SaqSubmission = {
      $type: submissionTypes.shortAnswerQuestion,
      answer: this.answer,
      reattemptCount: this.submissionReattemptCount
    };
    this.submissionIsProcessing = true;
    this.submissionService.submit(this.learningObject.id, submission).subscribe(feedback => {
      this.submissionReattemptCount++;
      this.feedbackConnector.sendToFeedback(feedback);
    });
  }
}
