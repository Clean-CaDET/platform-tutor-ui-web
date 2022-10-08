import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Course} from './course.model';
import {environment} from '../../../../environments/environment';
import {Unit} from '../unit/unit.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private http: HttpClient) {
  }

  getCourse(courseId: number): Observable<Course> {
    return this.http.get<Course>(environment.apiHost + 'course/' + courseId)
      .pipe(map(c => new Course(c)));
  }

  getUnitsByEnrollmentStatus(courseId: number): Observable<Unit[]> {
    return this.http.get<Unit[]>(environment.apiHost + 'learners/units/' + courseId);
  }
}
