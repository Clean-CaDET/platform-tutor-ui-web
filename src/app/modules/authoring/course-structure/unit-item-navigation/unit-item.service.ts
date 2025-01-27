import { Injectable } from '@angular/core';
import { UnitItem, UnitItemType } from './unit-item.model';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnitItemService {
  constructor(private http: HttpClient) { }

  getKcs(unitId: number): Observable<UnitItem[]> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('unitId', unitId);
    return this.http
      .get<any[]>(environment.apiHost + 'authoring/knowledge-components', { params: queryParams })
      .pipe(map(kcs => kcs.map(kc => ({
        id: kc.id,
        unitId: kc.knowledgeUnitId,
        order: kc.order,
        name: kc.name,
        type: UnitItemType.Kc
      }))));
  }

  getTasks(unitId: number): Observable<UnitItem[]> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('unitId', unitId);
    return this.http
      .get<any[]>(`${environment.apiHost}/authoring/units/${unitId}/learning-tasks`)
      .pipe(map(tasks => tasks.map(t => ({
        id: t.id,
        unitId: t.unitId,
        order: t.order,
        name: t.name,
        type: UnitItemType.Task
      }))));
  }
}
