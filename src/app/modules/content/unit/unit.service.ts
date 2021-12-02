import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Unit} from './model/unit.model';
import {environment} from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UnitService {
  units: Unit[];

  constructor(private http: HttpClient) {
  }

  getUnits(): Observable<Unit[]> {
    return this.http.get<Unit[]>(environment.apiHost + 'units')
      .pipe(tap(units => this.units = units));
  }
}
