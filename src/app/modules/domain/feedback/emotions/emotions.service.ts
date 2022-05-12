import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {AuthenticationService} from '../../../../infrastructure/auth/auth.service';
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

  constructor(private http: HttpClient, private authService: AuthenticationService, private snackBar: MatSnackBar) {
  }

  submitEmotionsFeedback(knowledgeComponentId: number, comment: string): void {
    const learnerId: number = this.authService.user$.value.learnerId;
    const feedback = {learnerId, knowledgeComponentId, comment};
    this.http.post<EmotionsFeedbackDTO>(environment.apiHost + 'feedback/emotions', feedback).subscribe(() => {
      // We should consider how this service and the improvement service tie in with the interfacing instructor.
      this.snackBar.open('Hvala na povratnoj informaciji 🙂!', null, { duration: 3000, panelClass: 'interfacing-instructor' });
    });
  }
}
