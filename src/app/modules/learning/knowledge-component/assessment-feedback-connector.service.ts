import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Feedback } from '../model/learning-objects/feedback.model';

@Injectable({providedIn: "root"})
export class AssessmentFeedbackConnector {
  observedAssessment: Subject<Feedback> = new Subject();
  observedFeedback: Subject<Feedback> = new Subject();

  sendToFeedback(feedback: Feedback): void {
    this.observedAssessment.next(feedback);
  }

  sendToAssessment(feedback: Feedback): void {
    this.observedFeedback.next(feedback);
  }
}
