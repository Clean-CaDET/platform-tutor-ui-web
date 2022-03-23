import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LearnerService} from '../../../learner/learner.service';
import {environment} from '../../../../../environments/environment';

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

  constructor(private http: HttpClient, private learnerService: LearnerService) {
  }

  submitImprovement(unitId: number, improvement: any): void {
    const learnerId: number = this.learnerService.learner$.value.id;
    const softwareComment = improvement.value.tutorImprovement;
    const contentComment = improvement.value.educationalContentImprovement;
    const tutorImprovement = {learnerId, unitId, softwareComment, contentComment};
    this.http.post<TutorImprovementDTO>(environment.apiHost + 'feedback/improvements', tutorImprovement).subscribe();
  }
}
