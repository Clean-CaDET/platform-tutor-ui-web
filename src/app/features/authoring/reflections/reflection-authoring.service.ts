import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Reflection } from '../../learning/reflection/reflection.model';

@Injectable({ providedIn: 'root' })
export class ReflectionAuthoringService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiHost + 'authoring/units/';

  getByUnit(unitId: number): Observable<Reflection[]> {
    return this.http.get<Reflection[]>(this.baseUrl + unitId + '/reflections');
  }

  create(unitId: number, reflection: Reflection): Observable<Reflection> {
    return this.http.post<Reflection>(this.baseUrl + unitId + '/reflections', reflection);
  }

  update(unitId: number, reflection: Reflection): Observable<Reflection> {
    return this.http.put<Reflection>(this.baseUrl + unitId + '/reflections', reflection);
  }

  delete(unitId: number, reflectionId: number): Observable<unknown> {
    return this.http.delete(this.baseUrl + unitId + '/reflections/' + reflectionId);
  }
}
