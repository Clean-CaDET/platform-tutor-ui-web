import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reflection, ReflectionAnswer } from './reflection.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReflectionService {
  constructor(private http: HttpClient) { }

  getByUnit(unitId: number) {
    return this.http.get<Reflection[]>(`${environment.apiHost}learning/units/${unitId}/reflections`);
  }

  get(reflectionId: number) {
    return this.http.get<Reflection>(`${environment.apiHost}learning/reflections/${reflectionId}`);
  }

  submit(reflectionId: number, reflectionSubmission: ReflectionAnswer) {
    return this.http.post(`${environment.apiHost}learning/reflections/${reflectionId}/answer`, reflectionSubmission);
  }
}
