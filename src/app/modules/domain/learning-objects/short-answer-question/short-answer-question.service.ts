import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {LearnerService} from '../../../learner/learner.service';
import {map} from 'rxjs/operators';
import { SaqEvaluation } from './saq-evaluation.model';

@Injectable({
  providedIn: 'root'
})
export class ShortAnswerQuestionService {

  constructor(private http: HttpClient, private learnerService: LearnerService) {
  }

  answerQuestion(assessmentEventId: number, answer: string): Observable<SaqEvaluation> {
    return this.http.post(
      environment.apiHost + 'submissions/short-answer',
      {
        assessmentEventId: assessmentEventId,
        learnerId: this.learnerService.learner$.value.id,
        answer: answer
      }).pipe(map(data => {
      return new SaqEvaluation(data);
    }));
  }
}
