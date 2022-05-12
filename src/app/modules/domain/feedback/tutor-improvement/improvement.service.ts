import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LearnerService} from '../../../../infrastructure/auth/learner.service';
import {environment} from '../../../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

interface TutorImprovementDTO {
  learnerId: number;
  unitId: number;
  softwareComment: string;
  contentComment: string;
}

@Injectable({
  providedIn: 'root'
})
export class ImprovementService {

  constructor(private http: HttpClient, private learnerService: LearnerService, private snackBar: MatSnackBar) {
  }

  submitImprovement(unitId: number, improvement: any): void {
    const learnerId: number = this.learnerService.learner$.value.id;
    const softwareComment = improvement.value.tutorImprovement;
    const contentComment = improvement.value.educationalContentImprovement;
    const tutorImprovement = {learnerId, unitId, softwareComment, contentComment};
    this.http.post<TutorImprovementDTO>(environment.apiHost + 'feedback/improvements', tutorImprovement).subscribe(() => {
      this.snackBar.open('Hvala puno na savetima za unapređenje 😊! Tvoji komentari utiču na stotine učenika koji će doći posle tebe.',
      null, { duration: 5000, panelClass: 'interfacing-instructor' });
    });
  }
}
