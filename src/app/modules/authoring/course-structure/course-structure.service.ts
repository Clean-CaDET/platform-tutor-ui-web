import {HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Course } from '../../learning/model/course.model';
import { Unit } from '../../learning/model/unit.model';
import {KnowledgeComponent} from "../../learning/model/knowledge-component.model";

@Injectable({
  providedIn: 'root'
})
export class CourseStructureService {

  constructor(private http: HttpClient) { }

  getCourse(courseId: number): Observable<Course> {
    return this.http.get<Course>(environment.apiHost + 'owned-courses/' + courseId);
  }

  getKnowledgeComponents(units: Unit[]): Observable<KnowledgeComponent>[] {
    const kcObservables : Observable<KnowledgeComponent>[] = [];
    units.forEach(
      unit => {
        let queryParams = new HttpParams();
        queryParams = queryParams.append('unitId', unit.id);
        kcObservables.push(this.http.get<KnowledgeComponent>(environment.apiHost + 'authoring/knowledge-components', { params: queryParams }))
      }
    )
    return kcObservables;
  }

  updateCourse(course: Course): Observable<Course> {
    return this.http.put<Course>(environment.apiHost + 'owned-courses/' + course.id, course);
  }

  saveUnit(courseId: number, unit: Unit): Observable<Unit> {
    return this.http.post<Unit>(environment.apiHost + 'authoring/courses/' + courseId + '/units', unit);
  }

  updateUnit(courseId: number, unit: Unit): Observable<Unit> {
    return this.http.put<Unit>(environment.apiHost + 'authoring/courses/' + courseId + '/units/' + unit.id, unit);
  }

  deleteUnit(courseId: number, unitId: number): Observable<Unit> {
    return this.http.delete<Unit>(environment.apiHost + 'authoring/courses/' + courseId + '/units/' + unitId);
  }
}
