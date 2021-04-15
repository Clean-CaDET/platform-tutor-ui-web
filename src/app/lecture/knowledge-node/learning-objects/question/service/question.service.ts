import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Answer } from '../model/answer.model';
import { environment } from '../../../../../../environments/environment';
import { TraineeService } from '../../../../../trainee/service/trainee.service';


@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private http: HttpClient, private traineeService: TraineeService) { }

  answerQuestion(nodeId: number, questionId: number, answers: Answer[]): Observable<any> {
    return this.http.post(
      environment.apiHost + 'nodes/' + nodeId + '/content/question',
      {
        questionId,
        traineeId: this.traineeService.trainee$.value.id,
        answers
      });
  }
}
