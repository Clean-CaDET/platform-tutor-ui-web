import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../../../shared/model/course.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class InstructorsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiHost + 'management/instructors/';

  getOwnedCourses(id: number): Observable<Course[]> {
    return this.http.get<Course[]>(this.baseUrl + id + '/ownerships/');
  }

  addOwnedCourse(instructorId: number, courseId: number): Observable<Course> {
    return this.http.post<Course>(this.baseUrl + instructorId + '/ownerships/', courseId);
  }

  removeOwnedCourse(instructorId: number, courseId: number): Observable<unknown> {
    return this.http.delete(this.baseUrl + instructorId + '/ownerships/' + courseId);
  }
}
