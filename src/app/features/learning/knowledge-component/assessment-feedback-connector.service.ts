import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Feedback } from '../model/feedback.model';

@Injectable({ providedIn: 'root' })
export class AssessmentFeedbackConnectorService {
  readonly assessmentToResult$ = new Subject<Feedback>();
  readonly resultToAssessment$ = new Subject<Feedback>();

  sendToResult(feedback: Feedback): void {
    this.assessmentToResult$.next(feedback);
  }

  sendToAssessment(feedback: Feedback): void {
    this.resultToAssessment$.next(feedback);
  }
}
