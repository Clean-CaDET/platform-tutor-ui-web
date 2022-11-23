import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LearnerGroup } from '../../learning/learner/learner-group.model';

@Injectable({
  providedIn: 'root',
})
export class InstructorService {
  constructor(private http: HttpClient) {}

  getCourses() {
    return this.http.get<any[]>(environment.apiHost + 'instructors/courses');
  }

  getGroups(courseId: number): Observable<LearnerGroup[]> {
    return this.http
      .get<LearnerGroup[]>(
        environment.apiHost + 'instructors/groups/' + courseId
      )
      .pipe(
        map((g) => {
          const groups = [];
          g.forEach((group) => groups.push(new LearnerGroup(group)));
          return groups;
        })
      );
  }
}
