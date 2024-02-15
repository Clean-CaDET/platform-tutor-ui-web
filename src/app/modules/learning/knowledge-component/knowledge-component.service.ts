import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { KnowledgeComponentStatistics } from '../model/knowledge-component-statistics.model';
import { KnowledgeComponent } from '../model/knowledge-component.model';
import { LearningObjectMapper } from './learning-objects/learning-object-mapper';
import { LearningObject } from './learning-objects/learning-object.model';
import { AuthenticationService } from 'src/app/infrastructure/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class KnowledgeComponentService {
  private baseUri: string = 'learning/knowledge-component/';

  constructor(private http: HttpClient, private learningObjectMapper: LearningObjectMapper, private auth: AuthenticationService) {}

  getKnowledgeComponent(kcId: number): Observable<KnowledgeComponent> {
    return this.http.get<KnowledgeComponent>(environment.apiHost + this.baseUri + kcId);
  }

  getSuitableAssessmentItem(kcId: number): Observable<LearningObject> {
    return this.http.get<LearningObject>(
      environment.apiHost + this.baseUri + kcId + '/assessment-item',
      { params: new HttpParams().set('aId', this.auth.clientId$.getValue()) })
      .pipe(map((ae) => this.learningObjectMapper.convert(ae)));
  }

  getInstructionalItems(kcId: number): Observable<LearningObject[]> {
    return this.http.get<LearningObject[]>(
      environment.apiHost + this.baseUri + kcId + '/instructional-items',
      { params: new HttpParams().set('aId', this.auth.clientId$.getValue()) })
      .pipe(map((los) => this.mapLearningObjects(los)));
  }

  getKnowledgeComponentStatistics(kcId: number): Observable<KnowledgeComponentStatistics> {
    return this.http.get<KnowledgeComponentStatistics>(environment.apiHost + 'learning/statistics/kcm/' + kcId);
  }

  getAssesmentItemStatistics(aiId: number): Observable<number> {
    return this.http.get<number>(environment.apiHost + 'learning/statistics/aim/' + aiId);
  }

  mapLearningObjects(instructionalItems: LearningObject[]): LearningObject[] {
    return instructionalItems.map((ie) => this.learningObjectMapper.convert(ie));
  }

  launchSession(kcId: number): Observable<unknown> {
    return this.http.post(environment.apiHost + 'learning/session/' + kcId + '/launch', null);
  }

  terminateSession(kcId: number): Observable<unknown> {
    return this.http.post(environment.apiHost + 'learning/session/' + kcId + '/terminate', null);
  }

  abandonSession(kcId: number): Observable<unknown> {
    return this.http.post(environment.apiHost + 'learning/session/' + kcId + '/abandon', null);
  }
}
