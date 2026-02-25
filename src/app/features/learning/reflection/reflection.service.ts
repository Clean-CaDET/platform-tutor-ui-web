import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Reflection, ReflectionAnswer } from './reflection.model';

@Injectable({ providedIn: 'root' })
export class ReflectionService {
  private readonly http = inject(HttpClient);

  getByUnit(unitId: number): Observable<Reflection[]> {
    return this.http.get<Reflection[]>(
      `${environment.apiHost}learning/units/${unitId}/reflections`,
    );
  }

  get(reflectionId: number): Observable<Reflection> {
    return this.http.get<Reflection>(
      `${environment.apiHost}learning/reflections/${reflectionId}`,
    );
  }

  submit(reflectionId: number, reflectionSubmission: ReflectionAnswer): Observable<unknown> {
    return this.http.post(
      `${environment.apiHost}learning/reflections/${reflectionId}/answer`,
      reflectionSubmission,
    );
  }
}
