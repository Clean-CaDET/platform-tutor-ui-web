import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import { LearningEvent } from './learning-event';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsInstructorService {
  constructor(private http: HttpClient) {}

  getAnalytics() {
    return this.http.get<Array<any>>(environment.apiHost + 'events').pipe(map(data => {
        let events = new Array<LearningEvent>();
        data.forEach(event => events.push(new LearningEvent(event)));
        return events;
    }));
  }
}
