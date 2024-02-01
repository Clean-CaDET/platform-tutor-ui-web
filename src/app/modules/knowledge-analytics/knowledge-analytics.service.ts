import {HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {Unit} from '../learning/model/unit.model';
import {Course} from '../learning/model/course.model';
import {KnowledgeComponentStatistics} from './model/knowledge-component-statistics.model';
import { AssessmentItemStatistics } from './model/assessment-item-statistics';
import {KnowledgeComponent} from "../learning/model/knowledge-component.model";

@Injectable({
  providedIn: 'root',
})
export class KnowledgeAnalyticsService {
  constructor(private http: HttpClient) {}

  getUnits(courseId: number): Observable<Unit[]> {
    return this.http
      .get<Course>(environment.apiHost + 'owned-courses/' + courseId)
      .pipe(map((data) => data.knowledgeUnits));
  }

  getTopMisconceptions(unitId: number): Observable<AssessmentItemStatistics[]> {
    return this.http.get<AssessmentItemStatistics[]>(environment.apiHost + `analysis/units/${unitId}`);
  }

  getKnowledgeComponents(unitId: number): Observable<KnowledgeComponent[]> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('unitId', unitId);
    return this.http.get<KnowledgeComponent[]>(environment.apiHost + 'authoring/knowledge-components', { params: queryParams });
  }

  getKnowledgeComponentStatistics(kcId: string): Observable<KnowledgeComponentStatistics> {
      return this.http.get<KnowledgeComponentStatistics>(environment.apiHost + `analysis/knowledge-components/${kcId}`);
  }

  getAssessmentItemStatistics(kcId: string): Observable<AssessmentItemStatistics[]> {
      return this.http.get<AssessmentItemStatistics[]>(environment.apiHost + `analysis/knowledge-components/${kcId}/assessments`);
  }
}
