import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {LearnerService} from '../../users/learner.service';

interface FeedbackDTO {
  rating: number;
  learnerId: number;
  learningObjectId: number;
}

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient, private learnerService: LearnerService) {
  }

  submitRating(rating: number, learningObjectId: number): void {
    const learnerId: number = this.learnerService.learner$.value.id;
    const feedback = {rating, learnerId, learningObjectId};
    this.http.post<FeedbackDTO>(environment.apiHost + 'feedback/', feedback).subscribe();
  }
}