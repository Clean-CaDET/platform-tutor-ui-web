import {HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {Group} from './model/group.model';
import {Unit} from '../learning/model/unit.model';
import {Course} from '../learning/model/course.model';
import {KnowledgeComponentStatistics} from './model/knowledge-component-statistics.model';
import { AssessmentItemStatistics } from './model/assessment-item-statistics';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
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

  getKnowledgeComponents(units: Unit[]): Observable<KnowledgeComponent>[] {
    const kcObservables : Observable<KnowledgeComponent>[] = [];
    units.forEach(
      unit => {
        let queryParams = new HttpParams();
        queryParams = queryParams.append('unitId', unit.id);
        kcObservables.push(this.http.get<KnowledgeComponent>(environment.apiHost + 'authoring/knowledge-components', { params: queryParams }))
      }
    )
    return kcObservables;
  }

  getGroups(courseId: number): Observable<PagedResults<Group>> {
    return this.http.get<PagedResults<Group>>(environment.apiHost + `monitoring/${courseId}/groups`);
  }

  getKnowledgeComponentStatistics(groupId: string, kcId: string): Observable<KnowledgeComponentStatistics> {
    if (groupId === '0') {
      return this.http.get<KnowledgeComponentStatistics>(environment.apiHost + `analysis/knowledge-components/${kcId}`);
    } else {
      return this.http.get<KnowledgeComponentStatistics>(environment.apiHost + `analysis/knowledge-components/${kcId}/groups/${groupId}`);
    }
  }

  getAssessmentItemStatistics(groupId: string, kcId: string): Observable<AssessmentItemStatistics[]> {
    if (groupId === '0') {
      return this.http.get<AssessmentItemStatistics[]>(environment.apiHost + `analysis/knowledge-components/${kcId}/assessments`);
    } else {
      return this.http.get<AssessmentItemStatistics[]>(environment.apiHost + `analysis/knowledge-components/${kcId}/assessments/groups/${groupId}`);
    }
  }
}
