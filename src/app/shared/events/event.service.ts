import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { LearningEvent } from 'src/app/modules/knowledge-analytics/model/learning-event.model';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: "root"})
export class EventService {
  exportOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    useBom: true,
    noDownload: false,
    headers: [
      'Type',
      'Timestamp',
      'Knowledge Component Id',
      'Learner Id',
      'Event-specific data',
    ],
  };

  private readonly baseUrl = environment.apiHost + 'analysis/knowledge-components/events/';

  constructor(private http: HttpClient) { }

  getByKcs(kcIds: number[], unitCode: string): Observable<void> {
    return this.http
      .post<LearningEvent[]>(this.baseUrl, kcIds)
      .pipe(map(data => this.exportEvents(data, unitCode + " events")));
  }

  getByLearnerAndKc(learnerId: number, kcId: number): Observable<void> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('learnerId', learnerId);
    queryParams = queryParams.append('kcId', kcId);
    return this.http.get<LearningEvent[]>(this.baseUrl + "learner", { params: queryParams })
      .pipe(map(data => this.exportEvents(data, "Learner " + learnerId + " - KC " + kcId + " - events")));
  }

  getByAi(aiId: number): Observable<void> {
    return this.http.get<LearningEvent[]>(this.baseUrl + "answers/" + aiId)
      .pipe(map(data => this.exportEvents(data, "Assessment " + aiId + " answers")));
  }

  private exportEvents(data: LearningEvent[], title: string) {
    const events = this.parseEvents(data);
    //new ngxCsv(events, title, this.exportOptions);
    // TODO: Replace ngxCsv with logic that does not use CommonJS.
  }

  private parseEvents(data: LearningEvent[]) {
    const events = new Array<LearningEvent>();
    data.forEach((event: any) => events.push(new LearningEvent(event)));

    for (const event of events) {
      if (event.specificData) {
        event.specificData = JSON.stringify(event.specificData);
      }
    }

    return events.sort((a, b) => a.timeStamp.getTime() - b.timeStamp.getTime());
  }
}
