import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {Group} from '../model/group.model';
import {LearningEvent} from '../model/learning-event.model';
import {Unit} from '../../learning/model/unit.model';
import {Course} from '../../learning/model/course.model';
import {KnowledgeComponentStatistics} from '../model/knowledge-component-statistics.model';
import {PagedResults} from '../../../shared/model/paged-results.model';


@Injectable({
  providedIn: 'root',
})
export class KnowledgeAnalyticsService {
  constructor(private http: HttpClient) {}

  getEvents(page: number, pageSize: number): Observable<PagedResults<LearningEvent>> {
    return this.http.get<any>(environment.apiHost + 'events', this.createParams(page, pageSize));
  }

  getAllEvents(): Observable<LearningEvent[]> {
    return this.http
      .get<LearningEvent[]>(environment.apiHost + 'events/all/')
      .pipe(
        map((data) => {
          const events = new Array<LearningEvent>();
          data.forEach((event) => events.push(new LearningEvent(event)));
          return events;
        })
      );
  }

  getUnits(courseId: number): Observable<Unit[]> {
    return this.http
      .get<Course>(environment.apiHost + 'owned-courses/' + courseId)
      .pipe(
        map((data) => data.knowledgeUnits)
      );
  }

  getKnowledgeComponentStatistics(groupId: string, unitId: string): Observable<KnowledgeComponentStatistics[]> {
    if (groupId === '0') {
      return this.http
        .get<KnowledgeComponentStatistics[]>(environment.apiHost + 'knowledge-analysis/' + unitId);
    } else {
      return this.http.get<KnowledgeComponentStatistics[]>(environment.apiHost + `knowledge-analysis/${unitId}/groups/${groupId}`);
    }
  }

  getGroups(courseId: number): Observable<Group[]> {
    return this.http.get<Group[]>(environment.apiHost + `monitoring/${courseId}/groups`);
  }

  private createParams(page: number, pageSize: number) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('page', page);
    queryParams = queryParams.append('pageSize', pageSize);

    return { params: queryParams };
  }
}
