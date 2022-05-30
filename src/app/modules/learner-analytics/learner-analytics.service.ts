import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import { LearningEvent } from './events-table/learning-event';
import { Unit } from '../domain/unit/unit.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LearnerAnalyticsService {
  constructor(private http: HttpClient) {}

  getEvents(page: number, pageSize: number) {
    return this.http.get<any>(environment.apiHost + 'analytics/events', this.createParams(page, pageSize)).pipe(map(data => {
        let events = new Array<LearningEvent>();
        data.results.forEach(event => events.push(new LearningEvent(event)));
        return {
          events: events,
          count: data.totalCount
        };
    }));
  }

  getLearners(page: number, pageSize: number, groupId: number) {
    var baseParams = this.createParams(page, pageSize);
    baseParams.params = baseParams.params.append("groupId", groupId);

    return this.http.get<any>(environment.apiHost + 'analytics/learner-progress', baseParams).pipe(map(data => {
        return {
          learnersProgress: data.results,
          count: data.totalCount
        };
    }));
  }

  getKnowledgeComponentStatistics(groupId: string, unitId: string) {
    let params = new HttpParams();
    params = params.append("groupId", groupId);
    params = params.append("unitId", unitId);

    return this.http.get<any>(environment.apiHost + 'analytics/kc-statistics', {params: params}).pipe(map(data => {
        return data;
    }));
  }

  getUnits(): Observable<Unit[]> {
    // TODO: Find a better place for this code & refactor analytics
    return this.http.get<Unit[]>(environment.apiHost + "domain/units").pipe(map(data => {
      let retVal = new Array();
      data.forEach(d => retVal.push(new Unit(d)));
      return retVal;
    }));
  }

  private createParams(page: number, pageSize: number) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("page", page);
    queryParams = queryParams.append("pageSize", pageSize);

    return { params: queryParams };
  }
}
