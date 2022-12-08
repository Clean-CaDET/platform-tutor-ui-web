import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Course } from './course/course.model';
import { LearningObjectMapper } from './knowledge-component/learning-objects/learning-object-mapper';
import { LearningObject } from './knowledge-component/learning-objects/learning-object.model';
import { KnowledgeComponentStatistics } from './knowledge-component/model/knowledge-component-statistics.model';
import { KnowledgeComponent } from './knowledge-component/model/knowledge-component.model';
import { Unit } from './unit/unit.model';

@Injectable({
  providedIn: 'root',
})
export class LearningService {
  constructor(
    private http: HttpClient,
    private learningObjectMapper: LearningObjectMapper
  ) {}

  getCourse(courseId: number): Observable<Course> {
    return this.http
      .get<Course>(environment.apiHost + 'course/' + courseId)
      .pipe(map((c) => new Course(c)));
  }

  getCourses() {
    return this.http.get<any[]>(environment.apiHost + 'learners/courses');
  }

  getUnit(unitId: number): Observable<Unit> {
    return this.http
      .get<Unit>(environment.apiHost + 'units/' + unitId)
      .pipe(map((unit) => new Unit(unit)));
  }

  getUnitsByEnrollmentStatus(courseId: number): Observable<Unit[]> {
    return this.http.get<Unit[]>(
      environment.apiHost + 'learners/units/' + courseId
    );
  }

  getKnowledgeComponent(kcId: number): Observable<KnowledgeComponent> {
    return this.http
      .get<KnowledgeComponent>(
        environment.apiHost + 'units/knowledge-components/' + kcId
      )
      .pipe(map((kc) => new KnowledgeComponent(kc)));
  }

  getSuitableAssessmentItem(kcId: number): Observable<LearningObject> {
    return this.http
      .get<LearningObject>(
        environment.apiHost +
          'units/knowledge-component/' +
          kcId +
          '/assessment-item'
      )
      .pipe(map((ae) => this.learningObjectMapper.convert(ae)));
  }

  getInstructionalItems(kcId: number): Observable<LearningObject[]> {
    return this.http
      .get<LearningObject[]>(
        environment.apiHost +
          'units/knowledge-components/' +
          kcId +
          '/instructional-items'
      )
      .pipe(map((los) => this.mapLearningObjects(los)));
  }

  getKnowledgeComponentStatistics(
    kcId: number
  ): Observable<KnowledgeComponentStatistics> {
    return this.http
      .get<KnowledgeComponentStatistics>(
        environment.apiHost + 'units/knowledge-components/statistics/' + kcId
      )
      .pipe(
        map(
          (knowledgeComponentStatistics) =>
            new KnowledgeComponentStatistics(knowledgeComponentStatistics)
        )
      );
  }

  mapLearningObjects(instructionalItems: LearningObject[]): LearningObject[] {
    instructionalItems = instructionalItems.map((ie) =>
      this.learningObjectMapper.convert(ie)
    );
    return instructionalItems;
  }

  launchSession(kcId: number): Observable<unknown> {
    return this.http.post(
      environment.apiHost +
        'units/knowledge-components/' +
        kcId +
        '/session/launch',
      null
    );
  }

  terminateSession(kcId: number): Observable<unknown> {
    return this.http.post(
      environment.apiHost +
        'units/knowledge-components/' +
        kcId +
        '/session/terminate',
      null
    );
  }
}
