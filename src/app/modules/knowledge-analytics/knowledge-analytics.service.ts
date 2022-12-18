import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Unit } from '../learning/unit/unit.model';
import { LearningEvent } from './events-table/learning-event';
import {Course} from '../learning/course/course.model';

@Injectable({
  providedIn: 'root',
})
export class KnowledgeAnalyticsService {
  constructor(private http: HttpClient) {}

  getEvents(page: number, pageSize: number) {
    return this.http
      .get<any>(
        environment.apiHost + 'events',
        this.createParams(page, pageSize)
      )
      .pipe(
        map((data) => {
          const events = new Array<LearningEvent>();
          data.results.forEach((event) =>
            events.push(new LearningEvent(event))
          );
          return {
            events,
            count: data.totalCount,
          };
        })
      );
  }

  getAllEvents() {
    return this.http
      .get<any>(environment.apiHost + 'events/all/')
      .pipe(
        map((data) => {
          const events = new Array<LearningEvent>();
          data.forEach((event) => events.push(new LearningEvent(event)));
          return {
            events,
          };
        })
      );
  }

  getUnits(courseId: number): Observable<Unit[]> {
    return this.http
      .get<Course>(environment.apiHost + 'owned-courses/' + courseId)
      .pipe(
        map((data) => {
          const retVal = [];
          data.knowledgeUnits.forEach((d) => retVal.push(new Unit(d)));
          return retVal;
        })
      );
  }

  getKnowledgeComponentStatistics(groupId: string, unitId: string) {
    if (groupId === '0') {
      return this.http
        .get<any>(environment.apiHost + 'knowledge-analysis/' + unitId)
        .pipe(
          map((data) => {
            return data;
          })
        );
    } else {
      return this.http
        .get<any>(environment.apiHost + 'knowledge-analysis/' + unitId + '/groups/' + groupId)
        .pipe(
          map((data) => {
            return data;
          })
        );
    }
  }

  getGroups(courseId: number) {
    return this.http.get<any[]>(
      environment.apiHost + `monitoring/${courseId}/groups`
    );
  }

  private createParams(page: number, pageSize: number) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('page', page);
    queryParams = queryParams.append('pageSize', pageSize);

    return { params: queryParams };
  }
}
