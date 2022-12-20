import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Course } from '../learning/course/course.model';
import { LearnerGroup } from '../learning/learner/learner-group.model';

@Injectable({
  providedIn: 'root',
})
export class GroupMonitoringService {
  constructor(private http: HttpClient) {}

  getCourse(courseId: number): Observable<Course> {
    return this.http
      .get<Course>(environment.apiHost + 'owned-courses/' + courseId)
      .pipe(map((c) => new Course(c)));
  }

  getLearners(
    page: number,
    pageSize: number,
    groupId: number,
    courseId: number
  ) {
    const baseParams = this.createParams(page, pageSize);
    return this.http
      .get<any>(environment.apiHost + `monitoring/${courseId}/groups/${groupId}`, baseParams).pipe(
        map((data) => {
          return {
            learnersProgress: data.results,
            count: data.totalCount,
          };
        })
      );
  }

  getGroups(courseId: number): Observable<LearnerGroup[]> {
    return this.http
      .get<LearnerGroup[]>(
        environment.apiHost + `monitoring/${courseId}/groups`
      )
      .pipe(
        map((g) => {
          const groups = [];
          g.forEach((group) => groups.push(new LearnerGroup(group)));
          return groups;
        })
      );
  }

  private createParams(page: number, pageSize: number) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('page', page);
    queryParams = queryParams.append('pageSize', pageSize);
    return { params: queryParams };
  }
}
