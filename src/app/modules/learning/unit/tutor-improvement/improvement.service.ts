import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

interface TutorImprovementDTO {
  unitId: number;
  softwareComment: string;
  contentComment: string;
}

@Injectable({providedIn: "root"})
export class ImprovementService {
  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  submitImprovement(unitId: number, improvement: any): void {
    const softwareComment = improvement.value.tutorImprovement;
    const contentComment = improvement.value.educationalContentImprovement;
    const tutorImprovement = { unitId, softwareComment, contentComment };
    this.http
      .post<TutorImprovementDTO>(
        environment.apiHost + 'learning/unit/' + unitId + '/feedback/improvements',
        tutorImprovement
      )
      .subscribe(() => {
        this.snackBar.open(
          'Hvala puno na savetima za unapređenje 😊! Tvoji komentari utiču na stotine učenika koji će doći posle tebe.',
          null,
          { duration: 5000, panelClass: 'interfacing-instructor' }
        );
      });
  }
}
