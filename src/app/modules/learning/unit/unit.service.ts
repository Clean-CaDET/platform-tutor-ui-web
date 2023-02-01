import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { KCMastery } from '../model/knowledge-component-mastery.model';
import { Unit } from '../model/unit.model';

@Injectable({
  providedIn: 'root',
})
export class UnitService {
  constructor(private http: HttpClient) {}

  getUnit(unitId: number): Observable<Unit> {
    return this.http.get<Unit>(environment.apiHost + 'learning/units/' + unitId);
  }

  getMasteries(unitId: number): Observable<KCMastery[]> {
    return this.http.get<KCMastery[]>(environment.apiHost + 'learning/units/' + unitId + '/masteries');
  }

}
