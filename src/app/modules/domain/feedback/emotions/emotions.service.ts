import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {LearnerService} from '../../../learner/learner.service';
import { MatSnackBar } from '@angular/material/snack-bar';

interface EmotionsFeedbackDTO {
  learnerId: number;
  knowledgeComponentId: number;
  comment: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmotionsService {

  constructor(private http: HttpClient, private learnerService: LearnerService, private snackBar: MatSnackBar) {
  }

  submitEmotionsFeedback(knowledgeComponentId: number, comment: string): void {
    const learnerId: number = this.learnerService.learner$.value.id;
    const feedback = {learnerId, knowledgeComponentId, comment};
    this.http.post<EmotionsFeedbackDTO>(environment.apiHost + 'feedback/emotions', feedback).subscribe(() => {
      this.snackBar.open('Hvala na povratnoj informaciji 🙂!', null, { duration: 3000 });
    });
  }
}
