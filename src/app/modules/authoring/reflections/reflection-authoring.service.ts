import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Reflection, ReflectionQuestionCategory } from '../../learning/reflection/reflection.model';

@Injectable({
  providedIn: 'root'
})
export class ReflectionAuthoringService {

  private baseUrl = environment.apiHost + 'authoring/units/';

  constructor(private http: HttpClient) { }

  getByUnit(unitId: number): Observable<Reflection[]> {
    return this.http.get<Reflection[]>(this.baseUrl + unitId + '/reflections');
  }

  getCategories(unitId: number): Observable<ReflectionQuestionCategory[]> {
    return this.http.get<ReflectionQuestionCategory[]>(this.baseUrl + unitId + '/reflections/categories');
  }

  create(unitId: number, reflection: Reflection) {
    return this.http.post<Reflection>(this.baseUrl + unitId + '/reflections', reflection);
  }

  update(unitId: number, reflection: Reflection) {
    return this.http.put<Reflection>(this.baseUrl + unitId + '/reflections', reflection);
  }

  delete(unitId: number, reflectionId: number) {
    return this.http.delete<Reflection>(this.baseUrl + unitId + '/reflections/' + reflectionId);
  }
}
