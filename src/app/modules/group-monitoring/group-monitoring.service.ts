import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Course } from '../learning/course/course.model';
import { LearnerGroup } from '../learning/learner/learner-group.model';
import { Unit } from '../learning/unit/unit.model';

@Injectable({
  providedIn: 'root',
})
export class GroupMonitoringService {
  constructor(private http: HttpClient) {}

  getCourse(courseId: number): Observable<Course> {
    return this.http
      .get<Course>(environment.apiHost + 'course/' + courseId)
      .pipe(map((c) => new Course(c)));
  }

  getLearners(
    page: number,
    pageSize: number,
    groupId: number,
    courseId: number
  ) {
    var baseParams = this.createParams(page, pageSize);
    baseParams.params = baseParams.params.append('groupId', groupId);
    baseParams.params = baseParams.params.append('courseId', courseId);
    return this.http
      .get<any>(environment.apiHost + 'analytics/learner-progress', baseParams)
      .pipe(
        map((data) => {
          return {
            learnersProgress: data.results,
            count: data.totalCount,
          };
        })
      );
  }

  getUnitsByCourse(courseId: string | number): Observable<Unit[]> {
    return this.http
      .get<Unit[]>(environment.apiHost + 'domain/units/' + courseId)
      .pipe(
        map((data) => {
          let retVal = new Array();
          data.forEach((d) => retVal.push(new Unit(d)));
          return retVal;
        })
      );
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

  private createParams(page: number, pageSize: number) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('page', page);
    queryParams = queryParams.append('pageSize', pageSize);

    return { params: queryParams };
  }
}
