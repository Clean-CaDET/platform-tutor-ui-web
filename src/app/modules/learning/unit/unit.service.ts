import {HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Unit } from '../model/unit.model';
import {KcWithMastery} from "../model/kc-with-mastery.model";

@Injectable({
  providedIn: 'root',
})
export class UnitService {
  constructor(private http: HttpClient) {}

  getUnit(unitId: number): Observable<Unit> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('unitId', unitId);
    return this.http.get<Unit>(environment.apiHost + 'enrolled-courses/unit', { params: queryParams} );
  }

  getKcsWithMasteries(unitId: number): Observable<KcWithMastery[]> {
    return this.http.get<KcWithMastery[]>(environment.apiHost + 'learning/units/' + unitId + '/masteries');
  }

}
