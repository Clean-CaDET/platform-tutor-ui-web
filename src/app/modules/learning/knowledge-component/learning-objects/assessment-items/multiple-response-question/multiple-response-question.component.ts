import { Component, OnDestroy, OnInit } from '@angular/core';
import { MultipleReponseQuestion } from './multiple-response-question.model';
import { LearningObjectComponent } from '../../learning-object-component';
import { AssessmentFeedbackConnector } from 'src/app/modules/learning/knowledge-component/assessment-feedback-connector.service';
import { shuffleArray } from 'src/app/modules/learning/knowledge-component/learning-objects/assessment-items/arrays';
import { MrqEvaluation } from 'src/app/modules/learning/model/learning-objects/multiple-response-question/mrq-evaluation.model';
import { MrqItem } from 'src/app/modules/learning/model/learning-objects/multiple-response-question/mrq-item.model';
import { MrqItemEvaluation } from 'src/app/modules/learning/model/learning-objects/multiple-response-question/mrq-item-evaluation.model';
import { SubmissionService } from '../../../submission.service';
import { MrqSubmission } from 'src/app/modules/learning/model/learning-objects/multiple-response-question/mrq-submission.model';
import { submissionTypes } from 'src/app/modules/learning/model/learning-objects/submission.model';
import { Subscription } from 'rxjs';
import { feedbackTypes } from 'src/app/modules/learning/model/learning-objects/feedback.model';

@Component({
  selector: 'cc-multiple-response-question',
  templateUrl: './multiple-response-question.component.html',
  styleUrls: ['./multiple-response-question.component.scss'],
})
export class MultipleResponseQuestionComponent implements OnInit, OnDestroy, LearningObjectComponent {
  learningObject: MultipleReponseQuestion;
  private observedFeedback: Subscription;

  submissionReattemptCount = 0;
  submissionIsProcessing: boolean;
  checked: boolean[];
  evaluation: MrqEvaluation;

  constructor(private submissionService: SubmissionService, private feedbackConnector: AssessmentFeedbackConnector) {
    this.checked = [];
  }

  ngOnInit(): void {
    this.submissionIsProcessing = false;
    this.learningObject.items = shuffleArray(this.learningObject.items);
    this.observedFeedback = this.feedbackConnector.observedFeedback.subscribe(feedback => {
      this.submissionIsProcessing = false;
      if(feedback.type === feedbackTypes.solution || feedback.type === feedbackTypes.correctness) {
        this.evaluation = feedback.evaluation as MrqEvaluation;
      }
    });
  }

  ngOnDestroy(): void {
    this.observedFeedback?.unsubscribe();
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
      $type: submissionTypes.mutlipleResponseQuestion,
      answers: this.checkedAnswers,
      reattemptCount: this.submissionReattemptCount
    };
    this.submissionIsProcessing = true;
    this.submissionService.submit(this.learningObject.id, submission).subscribe((feedback) => {
      this.submissionReattemptCount++;
      this.feedbackConnector.sendToFeedback(feedback);
    });
  }

  getAnswerResult(answer: string): MrqItemEvaluation {
    return this.evaluation.itemEvaluations.find((item) => item.text === answer);
  }
}
