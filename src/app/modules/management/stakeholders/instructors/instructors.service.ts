import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {Course} from '../../model/course.model';
import {environment} from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InstructorsService {
  baseUrl = environment.apiHost + 'management/instructors/';

  constructor(private http: HttpClient) {}

  getOwnedCourses(id: number): Observable<Course[]> {
    return this.http.get<Course[]>(this.baseUrl + id + "/ownerships/");
  }

  addOwnedCourse(instructorId: number, courseId: number): Observable<Course> {
    return this.http.post<Course>(this.baseUrl + instructorId + "/ownerships/", courseId);
  }

  removeOwnedCourse(instructorId: number, courseId: number) {
    return this.http.delete(this.baseUrl + instructorId + "/ownerships/" + courseId);
  }
}
