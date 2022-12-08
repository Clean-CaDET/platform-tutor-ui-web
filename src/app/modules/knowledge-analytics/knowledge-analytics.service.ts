import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Unit } from '../learning/unit/unit.model';
import { LearningEvent } from './events-table/learning-event';

@Injectable({
  providedIn: 'root',
})
export class KnowledgeAnalyticsService {
  constructor(private http: HttpClient) {}

  getEvents(page: number, pageSize: number) {
    return this.http
      .get<any>(
        environment.apiHost + 'analytics/events',
        this.createParams(page, pageSize)
      )
      .pipe(
        map((data) => {
          let events = new Array<LearningEvent>();
          data.results.forEach((event) =>
            events.push(new LearningEvent(event))
          );
          return {
            events: events,
            count: data.totalCount,
          };
        })
      );
  }

  getAllEvents() {
    return this.http
      .get<any>(environment.apiHost + 'analytics/all-events')
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

  getUnits(): Observable<Unit[]> {
    return this.http.get<Unit[]>(environment.apiHost + 'domain/units').pipe(
      map((data) => {
        let retVal = new Array();
        data.forEach((d) => retVal.push(new Unit(d)));
        return retVal;
      })
    );
  }

  getKnowledgeComponentStatistics(groupId: string, unitId: string) {
    let params = new HttpParams();
    params = params.append('groupId', groupId);
    params = params.append('unitId', unitId);

    return this.http
      .get<any>(environment.apiHost + 'analytics/kc-statistics', {
        params: params,
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getGroups() {
    return this.http.get<any[]>(environment.apiHost + 'learners/groups');
  }

  private createParams(page: number, pageSize: number) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('page', page);
    queryParams = queryParams.append('pageSize', pageSize);

    return { params: queryParams };
  }
}
