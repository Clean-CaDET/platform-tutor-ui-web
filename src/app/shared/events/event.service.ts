import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LearningEvent } from './learning-event.model';
import { saveAs } from '../../core/save-as.util';

@Injectable({ providedIn: 'root' })
export class EventService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiHost + 'analysis/knowledge-components/events/';

  private readonly csvHeaders = ['Type', 'Timestamp', 'Knowledge Component Id', 'Learner Id', 'Event-specific data'];

  getByKcs(kcIds: number[], unitCode: string): Observable<void> {
    return this.http
      .post<Record<string, unknown>[]>(this.baseUrl, kcIds)
      .pipe(map(data => this.exportEvents(data, unitCode + ' events')));
  }

  getByLearnerAndKc(learnerId: number, kcId: number): Observable<void> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('learnerId', learnerId);
    queryParams = queryParams.append('kcId', kcId);
    return this.http.get<Record<string, unknown>[]>(this.baseUrl + 'learner', { params: queryParams })
      .pipe(map(data => this.exportEvents(data, 'Learner ' + learnerId + ' - KC ' + kcId + ' - events')));
  }

  getByAi(aiId: number): Observable<void> {
    return this.http.get<Record<string, unknown>[]>(this.baseUrl + 'answers/' + aiId)
      .pipe(map(data => this.exportEvents(data, 'Assessment ' + aiId + ' answers')));
  }

  private exportEvents(data: Record<string, unknown>[], title: string): void {
    const events = this.parseEvents(data);
    const csvContent = this.toCsv(events);
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, title + '.csv');
  }

  private parseEvents(data: Record<string, unknown>[]): LearningEvent[] {
    const events = data.map(e => new LearningEvent(e));
    return events.sort((a, b) => a.timeStamp.getTime() - b.timeStamp.getTime());
  }

  private toCsv(events: LearningEvent[]): string {
    const rows = events.map(e =>
      [e.type, e.timeStamp.toISOString(), e.knowledgeComponentId, e.learnerId, e.specificData ?? '']
        .map(v => '"' + String(v).replace(/"/g, '""') + '"')
        .join(',')
    );
    return [this.csvHeaders.join(','), ...rows].join('\n');
  }
}
