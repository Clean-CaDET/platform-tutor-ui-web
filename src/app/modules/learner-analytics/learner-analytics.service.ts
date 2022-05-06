import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import { LearningEvent } from './events-table/learning-event';

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

  getLearners(page: number, pageSize: number) {
    return this.http.get<any>(environment.apiHost + 'analytics/learner-progress', this.createParams(page, pageSize)).pipe(map(data => {
        return {
          learnersProgress: data.results,
          count: data.totalCount
        };
    }));
  }

  private createParams(page: number, pageSize: number) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("page", page);
    queryParams = queryParams.append("pageSize", pageSize);

    return { params: queryParams };
  }
}
