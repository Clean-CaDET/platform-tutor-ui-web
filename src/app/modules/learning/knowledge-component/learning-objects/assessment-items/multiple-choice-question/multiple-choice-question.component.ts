import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AssessmentFeedbackConnector } from 'src/app/modules/learning/knowledge-component/assessment-feedback-connector.service';
import { feedbackTypes } from 'src/app/modules/learning/model/learning-objects/feedback.model';
import { McqEvaluation } from 'src/app/modules/learning/model/learning-objects/multiple-choice-question/mcq-evaluation.model';
import { McqSubmission } from 'src/app/modules/learning/model/learning-objects/multiple-choice-question/mcq-submission.model';
import { submissionTypes } from 'src/app/modules/learning/model/learning-objects/submission.model';
import { shuffleArray } from 'src/app/modules/learning/knowledge-component/learning-objects/assessment-items/arrays';
import { SubmissionService } from '../../../submission.service';
import { LearningObjectComponent } from '../../learning-object-component';
import { MultipleChoiceQuestion } from './multiple-choice-question.model';
import { ClipboardButtonComponent } from 'src/app/shared/markdown/clipboard-button/clipboard-button.component';

@Component({
  selector: 'cc-multiple-choice-question',
  templateUrl: './multiple-choice-question.component.html',
  styleUrls: ['./multiple-choice-question.component.scss'],
})
export class MultipleChoiceQuestionComponent implements OnInit, OnDestroy, LearningObjectComponent {
  readonly clipboard = ClipboardButtonComponent;

  learningObject: MultipleChoiceQuestion;
  private observedFeedback: Subscription;

  submissionReattemptCount = 0;
  submissionIsProcessing: boolean;
  checked: string;
  evaluation: McqEvaluation;

  constructor(private submissionService: SubmissionService, private feedbackConnector: AssessmentFeedbackConnector) {}

  ngOnInit(): void {
    this.submissionIsProcessing = false;
    this.learningObject.possibleAnswers = shuffleArray(this.learningObject.possibleAnswers);
    this.observedFeedback = this.feedbackConnector.observedFeedback.subscribe(feedback => {
      this.submissionIsProcessing = false;
      if(feedback.type === feedbackTypes.solution || feedback.type === feedbackTypes.correctness) {
        this.evaluation = feedback.evaluation as McqEvaluation;
      }
    });
  }

  ngOnDestroy(): void {
    this.observedFeedback?.unsubscribe();
  }

  onSubmit(): void {
    const submission: McqSubmission = {
      $type: submissionTypes.mutlipleChoiceQuestion,
      answer: this.checked,
      reattemptCount: this.submissionReattemptCount
    };
    this.submissionIsProcessing = true;
    this.submissionService.submit(this.learningObject.id, submission).subscribe((feedback) => {
      this.submissionReattemptCount++;
      this.feedbackConnector.sendToFeedback(feedback);
    });
  }

  checkItemCorrectness(item: string) {
    if (item !== this.checked) return '';
    return this.evaluation.correctnessLevel === 1 ? 'color-correct' : 'color-wrong';
  }
}
