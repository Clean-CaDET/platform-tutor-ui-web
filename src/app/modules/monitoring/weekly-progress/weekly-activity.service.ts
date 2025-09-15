import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UnitHeader } from './model/unit-header.model';
import { UnitProgressStatistics } from './model/unit-statistics.model';

@Injectable({
  providedIn: 'root'
})
export class WeeklyActivityService {
  baseUrl = environment.apiHost + `monitoring/learners/`;

  constructor(private http: HttpClient) { }

  getWeeklyUnitsWithItems(courseId: number, learnerId: number, weekEnd: Date): Observable<UnitHeader[]> {
    let queryParams = new HttpParams()
      .append('courseId', courseId)
      .append('weekEnd', `${weekEnd.getMonth() + 1}/${weekEnd.getDate()}/${weekEnd.getFullYear()}`);
    const baseParams = { params: queryParams };
    
    return this.http.get<UnitHeader[]>(this.baseUrl + learnerId, baseParams);
  }

  GetTaskAndKcStatistics(unitIds: number[], learnerId: number, groupMemberIds: number[]): Observable<UnitProgressStatistics[]> {
    let queryParams = new HttpParams();
    unitIds.forEach(unitId => {
      queryParams = queryParams.append('unitIds', unitId.toString());
    });
    return this.http.post<UnitProgressStatistics[]>(this.baseUrl + learnerId + "/statistics", groupMemberIds, { params: queryParams });
  }
}