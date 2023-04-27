import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {Course} from '../../learning/model/course.model';
import {LearnerGroup} from '../model/learner-group.model';
import {PagedResults} from '../../../shared/model/paged-results.model';
import { Learner } from '../model/learner.model';
import { KnowledgeComponentProgress } from '../model/knowledge-component-progress.model';
import { LearningEvent } from '../../knowledge-analytics/model/learning-event.model';

@Injectable({
  providedIn: 'root',
})
export class GroupMonitoringService {
  constructor(private http: HttpClient) {}

  getCourse(courseId: number): Observable<Course> {
    return this.http.get<Course>(environment.apiHost + 'owned-courses/' + courseId);
  }

  getGroups(courseId: number): Observable<PagedResults<LearnerGroup>> {
    return this.http.get<PagedResults<LearnerGroup>>(environment.apiHost + `monitoring/${courseId}/groups`);
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

  getEvents(learnerId: number, kcId: number): Observable<LearningEvent[]> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('learnerId', learnerId);
    queryParams = queryParams.append('kcId', kcId);
    return this.http.get<LearningEvent[]>(environment.apiHost + "events/learner", { params: queryParams })
      .pipe(
        map((data) => {
          const events = new Array<LearningEvent>();
          data.forEach((event) => events.push(new LearningEvent(event)));
          return events;
        })
      );
  }
}
