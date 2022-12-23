import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Course } from '../learning/model/course.model';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  constructor(private http: HttpClient) {}

  getCourses() {
    return this.http.get<Course[]>(environment.apiHost + 'enrolled-courses');
  }
}
