import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MrqItem } from 'src/app/modules/learning/model/learning-objects/multiple-response-question/mrq-item.model';
import { MrqEvaluation } from 'src/app/modules/learning/model/learning-objects/multiple-response-question/mrq-evaluation.model';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  constructor(private http: HttpClient) {}

  answerQuestion(
    questionId: number,
    answers: MrqItem[]
  ): Observable<MrqEvaluation> {
    return this.http
      .post<MrqEvaluation>(environment.apiHost + 'submissions/question', {
        assessmentItemId: questionId,
        answers,
      });
  }
}
