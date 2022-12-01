import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LearnerGroup } from '../learning/learner/learner-group.model';

@Injectable({
  providedIn: 'root',
})
export class LayoutInstructorService {
  constructor(private http: HttpClient) {}

  getCourses() {
    return this.http.get<any[]>(environment.apiHost + 'instructors/courses');
  }
}
