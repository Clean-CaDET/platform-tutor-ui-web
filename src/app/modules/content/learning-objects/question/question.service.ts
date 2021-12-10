import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MrqItem } from './model/answer.model';
import { environment } from '../../../../../environments/environment';
import { LearnerService } from '../../../users/learner.service';


@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private http: HttpClient, private learnerService: LearnerService) { }

  answerQuestion(nodeId: number, questionId: number, answers: MrqItem[]): Observable<any> {
    return this.http.post(
      environment.apiHost + 'submissions/question',
      {
        assessmentEventId: questionId,
        learnerId: this.learnerService.learner$.value.id,
        answers
      });
  }
}
