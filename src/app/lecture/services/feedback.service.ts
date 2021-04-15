import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {TraineeService} from '../../trainee/service/trainee.service';

interface FeedbackDTO {
  rating: number;
  traineeId: number;
  learningObjectId: number;
}

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient, private traineeService: TraineeService) {
  }

  submitRating(rating: number, learningObjectId: number): void {
    const traineeId: number = this.traineeService.trainee$.value.id;
    const feedback = {rating, traineeId, learningObjectId};
    this.http.post<FeedbackDTO>(environment.apiHost + 'feedbacks/submit', feedback).subscribe();
  }
}
