import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {TraineeService} from '../../users/trainee.service';

interface FeedbackDTO {
  rating: number;
  learnerId: number;
  learningObjectId: number;
}

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient, private traineeService: TraineeService) {
  }

  submitRating(rating: number, learningObjectId: number): void {
    const learnerId: number = this.traineeService.trainee$.value.id;
    const feedback = {rating, learnerId, learningObjectId};
    this.http.post<FeedbackDTO>(environment.apiHost + 'feedback/', feedback).subscribe();
  }
}
