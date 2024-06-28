import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Unit } from '../model/unit.model';
import {KcWithMastery} from "../model/kc-with-mastery.model";

@Injectable({providedIn: "root"})
export class UnitService {
  constructor(private http: HttpClient) {}

  getUnit(courseId: number, unitId: number): Observable<Unit> {
    return this.http.get<Unit>(environment.apiHost + 'enrolled-courses/' + courseId + '/units/' + unitId );
  }

  getKcsWithMasteries(unitId: number): Observable<KcWithMastery[]> {
    return this.http.get<KcWithMastery[]>(environment.apiHost + 'learning/units/' + unitId + '/masteries');
  }

}
