import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SaqEvaluation } from 'src/app/modules/learning/model/learning-objects/short-answer-question/saq-evaluation.model';

@Injectable({
  providedIn: 'root',
})
export class ShortAnswerQuestionService {
  constructor(private http: HttpClient) {}

  answerQuestion(
    assessmentItemId: number,
    answer: string
  ): Observable<SaqEvaluation> {
    return this.http
      .post<SaqEvaluation>(environment.apiHost + 'submissions/short-answer', {
        assessmentItemId: assessmentItemId,
        answer: answer,
      });
  }
}
