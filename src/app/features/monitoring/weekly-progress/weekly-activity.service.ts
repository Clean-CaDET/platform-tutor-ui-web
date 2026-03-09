import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UnitHeader } from './model/unit-header.model';
import { UnitProgressStatistics } from './model/unit-statistics.model';

@Injectable({ providedIn: 'root' })
export class WeeklyActivityService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiHost + 'monitoring/learners/';

  getWeeklyUnitsWithItems(courseId: number, learnerId: number, weekEnd: Date): Observable<UnitHeader[]> {
    const params = new HttpParams()
      .append('courseId', courseId)
      .append('weekEnd', `${weekEnd.getMonth() + 1}/${weekEnd.getDate()}/${weekEnd.getFullYear()}`);
    return this.http.get<UnitHeader[]>(this.baseUrl + learnerId, { params });
  }

  getTaskAndKcStatistics(unitIds: number[], learnerId: number, groupMemberIds: number[]): Observable<UnitProgressStatistics[]> {
    let params = new HttpParams();
    unitIds.forEach(unitId => {
      params = params.append('unitIds', unitId.toString());
    });
    return this.http.post<UnitProgressStatistics[]>(this.baseUrl + learnerId + '/statistics', groupMemberIds, { params });
  }
}
