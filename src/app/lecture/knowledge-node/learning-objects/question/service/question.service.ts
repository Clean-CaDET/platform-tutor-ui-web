import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private http: HttpClient) { }

  answerQuestion(questionId: number, answerIds: number[]): Observable<any> {
    const answerDTO = {
      questionId,
      answerIds
    };
    // TODO: API call to answer a question
    return of(null);
  }
}
