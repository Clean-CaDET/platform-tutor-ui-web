import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Course } from '../model/course.model';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private readonly http = inject(HttpClient);

  getCourse(courseId: number): Observable<Course> {
    return this.http.get<Course>(`${environment.apiHost}enrolled-courses/${courseId}`).pipe(
      map(course => {
        if (course.knowledgeUnits) {
          course.knowledgeUnits = course.knowledgeUnits
            .map(u => ({ ...u, bestBefore: u.bestBefore ? new Date(u.bestBefore) : undefined }))
            .sort((a, b) => a.order - b.order);
        }
        return course;
      }),
    );
  }

  getMasteredUnitIds(courseId: number, unitIds: number[]): Observable<number[]> {
    return this.http.post<number[]>(`${environment.apiHost}enrolled-courses/${courseId}/units/master`, unitIds);
  }
}
