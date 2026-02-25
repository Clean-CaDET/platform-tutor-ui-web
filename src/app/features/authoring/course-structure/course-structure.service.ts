import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Course } from '../../../shared/model/course.model';
import { Unit } from '../../../shared/model/unit.model';

@Injectable({ providedIn: 'root' })
export class CourseStructureService {
  private readonly http = inject(HttpClient);

  getCourse(courseId: number): Observable<Course> {
    return this.http.get<Course>(`${environment.apiHost}owned-courses/${courseId}`);
  }

  updateCourse(course: Course): Observable<Course> {
    return this.http.put<Course>(`${environment.apiHost}owned-courses/${course.id}`, course);
  }

  saveUnit(courseId: number, unit: Unit): Observable<Unit> {
    return this.http.post<Unit>(`${environment.apiHost}authoring/courses/${courseId}/units`, unit);
  }

  updateUnit(courseId: number, unit: Unit): Observable<Unit> {
    return this.http.put<Unit>(`${environment.apiHost}authoring/courses/${courseId}/units/${unit.id}`, unit);
  }

  deleteUnit(courseId: number, unitId: number): Observable<Unit> {
    return this.http.delete<Unit>(`${environment.apiHost}authoring/courses/${courseId}/units/${unitId}`);
  }
}
