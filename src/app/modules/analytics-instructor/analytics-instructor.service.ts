import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import { LearningEvent } from './learning-event';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsInstructorService {
  constructor(private http: HttpClient) {}

  getAnalytics(page: number, pageSize: number) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("page", page);
    queryParams = queryParams.append("pageSize", pageSize);

    return this.http.get<any>(environment.apiHost + 'events', {params: queryParams}).pipe(map(data => {
        let events = new Array<LearningEvent>();
        data.results.forEach(event => events.push(new LearningEvent(event)));
        return {
          events: events,
          count: data.totalCount
        };
    }));
  }
}
