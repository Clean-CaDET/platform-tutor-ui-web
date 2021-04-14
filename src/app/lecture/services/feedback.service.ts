import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

interface FeedbackDTO {
  rating: number;
  traineeId: number;
  learningObjectId: number;
}

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient) {
  }

  submitRating(rating: number): void {
    const feedback = {rating, traineeId: 1, learningObjectId: 1}; // TODO: get trainee and learning object
    this.http.post<FeedbackDTO>(environment.apiHost + 'feedbacks/submit', feedback).subscribe();
  }
}
