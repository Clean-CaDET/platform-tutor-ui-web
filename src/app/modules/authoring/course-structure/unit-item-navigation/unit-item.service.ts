import { Injectable } from '@angular/core';
import { UnitItem } from './unit-item.model';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnitItemService {
  constructor(private http: HttpClient) { }

  getByUnit(courseId: number, unitId: number): Observable<UnitItem[]> {
    return this.http.get<UnitItem[]>(`${environment.apiHost}/authoring/courses/${courseId}/units/${unitId}`);
  }
}
