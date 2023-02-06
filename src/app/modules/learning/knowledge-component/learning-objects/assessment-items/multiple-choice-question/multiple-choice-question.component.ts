import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AssessmentFeedbackConnector } from 'src/app/modules/learning/knowledge-component/assessment-feedback-connector.service';
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
export class MultipleChoiceQuestionComponent implements OnInit, OnDestroy, LearningObjectComponent {
  learningObject: MultipleChoiceQuestion;
  
  checked: string;
  submissionReattemptCount = 0;
  evaluation: McqEvaluation;
  private observedFeedback: Subscription;

  constructor(private submissionService: SubmissionService, private feedbackConnector: AssessmentFeedbackConnector) {}

  ngOnInit(): void {
    this.learningObject.possibleAnswers = shuffleArray(this.learningObject.possibleAnswers);
    this.observedFeedback = this.feedbackConnector.observedFeedback.subscribe(feedback => {
      this.evaluation = feedback.evaluation as McqEvaluation;
    });
  }

  ngOnDestroy(): void {
    this.observedFeedback?.unsubscribe();
  }

  onSubmit(): void {
    const submission: McqSubmission = {
      typeDiscriminator: submissionTypes.mutlipleChoiceQuestion,
      answer: this.checked,
      reattemptCount: this.submissionReattemptCount
    };
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
