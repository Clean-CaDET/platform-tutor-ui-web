import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { McqEvaluation } from 'src/app/modules/learning/model/learning-objects/multiple-choice-question/mcq-evaluation.model';

@Injectable({
  providedIn: 'root',
})
export class MultipleChoiceQuestionService {
  constructor(private http: HttpClient) {}

  submit(assessmentItemId: number, answer: string): Observable<McqEvaluation> {
    return this.http
      .post<McqEvaluation>(environment.apiHost + 'submissions/multiple-choice-question', {
        assessmentItemId,
        answer,
      });
  }
}
