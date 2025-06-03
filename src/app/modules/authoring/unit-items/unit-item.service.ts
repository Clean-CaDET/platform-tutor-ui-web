import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import { UnitItem, UnitItemType } from './unit-item.model';

@Injectable({
  providedIn: 'root'
})
export class UnitItemService {
  constructor(private http: HttpClient) { }

  getUnitItems(unitId: number): Observable<UnitItem[]> {
    return forkJoin([
      this.getKcs(unitId),
      this.getTasks(unitId)
    ]).pipe(
      map(([kcResults, taskResults]) => {
        kcResults.push(...taskResults);
        return kcResults.sort((a, b) => a.order - b.order);
      })
    );
  }

  private getKcs(unitId: number): Observable<UnitItem[]> {
    let queryParams = new HttpParams().set('unitId', unitId);
    return this.http
      .get<any[]>(environment.apiHost + 'authoring/knowledge-components', { params: queryParams })
      .pipe(map(kcs => kcs.map(kc => ({
        id: kc.id,
        unitId: kc.knowledgeUnitId,
        order: kc.order,
        name: kc.name,
        description: kc.description,
        type: UnitItemType.Kc
      }))));
  }

  private getTasks(unitId: number): Observable<UnitItem[]> {
    return this.http
      .get<any[]>(`${environment.apiHost}authoring/units/${unitId}/learning-tasks`)
      .pipe(map(tasks => tasks.map(t => ({
        id: t.id,
        unitId: t.unitId,
        order: t.order,
        name: t.name,
        description: this.shorten(t.description),
        type: UnitItemType.Task
      }))));
  }

  shorten(text: string): string {
    if (text.length <= 500) return text;
    return text.substring(0, 500) + "...";
  }
}
