import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {Course} from '../../learning/model/course.model';
import {LearnerGroup} from '../../learning/model/learner-group.model';
import {PagedResults} from '../../../shared/model/paged-results.model';
import { Learner } from '../../knowledge-analytics/model/learner.model';
import { KnowledgeComponentProgress } from '../model/knowledge-component-progress.model';

@Injectable({
  providedIn: 'root',
})
export class GroupMonitoringService {
  constructor(private http: HttpClient) {}

  private baseUrl(courseId: number) {
    return environment.apiHost + `monitoring/${courseId}/`;
  }

  getCourse(courseId: number): Observable<Course> {
    return this.http.get<Course>(environment.apiHost + 'owned-courses/' + courseId);
  }

  getGroups(courseId: number): Observable<LearnerGroup[]> {
    return this.http.get<LearnerGroup[]>(this.baseUrl(courseId));
  }

  getLearners(page: number, pageSize: number, groupId: number, courseId: number): Observable<PagedResults<Learner>> {
    const baseParams = this.createParams(page, pageSize);
    return this.http.get<PagedResults<Learner>>(this.baseUrl(courseId)+`groups/${groupId}`, baseParams);
  }

  private createParams(page: number, pageSize: number) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('page', page);
    queryParams = queryParams.append('pageSize', pageSize);
    return { params: queryParams };
  }

  getProgress(courseId: number, unitId: number, learnerIds: number[]): Observable<KnowledgeComponentProgress[]> {
    return this.http.post<KnowledgeComponentProgress[]>(this.baseUrl(courseId)+`progress/${unitId}`, learnerIds);
  }
}
