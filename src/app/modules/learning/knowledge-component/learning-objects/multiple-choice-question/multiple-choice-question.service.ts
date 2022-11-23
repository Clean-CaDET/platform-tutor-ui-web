import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { map } from 'rxjs/operators';
import { McqEvaluation } from './model/mcq-evaluation.model';

@Injectable({
  providedIn: 'root',
})
export class MultipleChoiceQuestionService {
  constructor(private http: HttpClient) {}

  submit(assessmentItemId: number, answer: string): Observable<McqEvaluation> {
    return this.http
      .post(environment.apiHost + 'submissions/multiple-choice-question', {
        assessmentItemId,
        answer,
      })
      .pipe(
        map((data) => {
          return new McqEvaluation(data);
        })
      );
  }
}
