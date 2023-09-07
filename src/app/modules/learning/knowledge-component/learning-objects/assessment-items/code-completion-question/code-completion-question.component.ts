import { Component, OnDestroy, OnInit } from '@angular/core';
import { LearningObjectComponent } from '../../learning-object-component';
import { CodeCompletionQuestion } from './model/ccq.model';
import { Subscription } from 'rxjs';
import { feedbackTypes } from 'src/app/modules/learning/model/learning-objects/feedback.model';
import { submissionTypes } from 'src/app/modules/learning/model/learning-objects/submission.model';
import { AssessmentFeedbackConnector } from '../../../assessment-feedback-connector.service';
import { SubmissionService } from '../../../submission.service';
import { CcqEvaluation } from 'src/app/modules/learning/model/learning-objects/code-completion-question/ccq-evaluation.model';
import { CcqSubmission } from 'src/app/modules/learning/model/learning-objects/code-completion-question/ccq-submission.model';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'cc-code-completion-question',
  templateUrl: './code-completion-question.component.html',
  styleUrls: ['./code-completion-question.component.scss']
})
export class CodeCompletionQuestionComponent implements OnInit, OnDestroy, LearningObjectComponent {
  learningObject: CodeCompletionQuestion;
  
  private observedFeedback: Subscription;

  submissionReattemptCount = 0;
  submissionIsProcessing: boolean;

  evaluation: CcqEvaluation;

  form: FormGroup

  constructor(private submissionService: SubmissionService, private feedbackConnector: AssessmentFeedbackConnector, private builder: FormBuilder) {}

  ngOnInit(): void {
    this.observedFeedback = this.feedbackConnector.observedFeedback.subscribe(feedback => {
      this.submissionIsProcessing = false;
      if(feedback.type === feedbackTypes.solution || feedback.type === feedbackTypes.correctness) {
        this.evaluation = feedback.evaluation as CcqEvaluation;
      }
    });
    
    let items: FormGroup[] = [];
    this.learningObject.items.forEach(i => {
      items.push(this.builder.group({
        answer: ['', Validators.required],
        order: [i.order]
      }));
    });
    this.form = this.builder.group({
      codeItems: this.builder.array(items)
    });
  }

  get items(): FormArray {
    return this.form.controls["codeItems"] as FormArray;
  };

  ngOnDestroy(): void {
    this.observedFeedback?.unsubscribe();
  }

  onSubmit(): void {
    const submission: CcqSubmission = {
      $type: submissionTypes.codeCompletionQuestion,
      items: this.form.value['codeItems'],
      reattemptCount: this.submissionReattemptCount
    };
    this.submissionIsProcessing = true;
    this.submissionService.submit(this.learningObject.id, submission).subscribe((feedback) => {
      this.submissionReattemptCount++;
      this.feedbackConnector.sendToFeedback(feedback);
    });
  }
}
