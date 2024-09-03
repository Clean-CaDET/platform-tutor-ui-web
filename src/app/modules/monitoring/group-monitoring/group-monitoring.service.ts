import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {Group} from '../model/group.model';
import {PagedResults} from '../../../shared/model/paged-results.model';
import { Learner } from '../model/learner.model';
import { KnowledgeComponentProgress } from '../model/knowledge-component-progress.model';

@Injectable({providedIn: "root"})
export class GroupMonitoringService {
  constructor(private http: HttpClient) {}

  getGroups(courseId: number): Observable<PagedResults<Group>> {
    return this.http.get<PagedResults<Group>>(environment.apiHost + `monitoring/${courseId}/groups`);
  }

  getLearners(page: number, pageSize: number, groupId: number, courseId: number): Observable<PagedResults<Learner>> {
    const baseParams = this.createParams(page, pageSize);
    return this.http.get<PagedResults<Learner>>
      (environment.apiHost + `monitoring/${courseId}/groups/${groupId}`, baseParams);
  }

  private createParams(page: number, pageSize: number) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('page', page);
    queryParams = queryParams.append('pageSize', pageSize);
    return { params: queryParams };
  }

  getProgress(unitId: number, learnerIds: number[]): Observable<KnowledgeComponentProgress[]> {
    return this.http.post<KnowledgeComponentProgress[]>
      (environment.apiHost + `monitoring/progress/${unitId}`, learnerIds);
  }
}
