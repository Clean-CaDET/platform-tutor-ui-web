import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LearningTasksService {

  private baseUrl = environment.apiHost + 'authoring/units/';

  constructor(private http: HttpClient) { }

  getByUnit(unitId: number): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + unitId + '/learning-tasks');
  }

  create(unitId: number, learningTask: any) {
    return this.http.post<any>(this.baseUrl + unitId + '/learning-tasks', learningTask);
  }

  update(unitId: number, learningTask: any) {
    return this.http.put<any>(this.baseUrl + unitId + '/learning-tasks', learningTask);
  }
}
