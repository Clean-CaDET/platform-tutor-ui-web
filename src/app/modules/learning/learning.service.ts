import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Course } from './model/course.model';
import { LearningObjectMapper } from './knowledge-component/learning-objects/learning-object-mapper';
import { LearningObject } from './knowledge-component/learning-objects/learning-object.model';
import { Unit } from './model/unit.model';
import { KnowledgeComponent } from './model/knowledge-component.model';
import { KnowledgeComponentStatistics } from './model/knowledge-component-statistics.model';

@Injectable({
  providedIn: 'root',
})
export class LearningService {
  constructor(
    private http: HttpClient,
    private learningObjectMapper: LearningObjectMapper
  ) {}

  getCourse(courseId: number): Observable<Course> {
    return this.http.get<Course>(environment.apiHost + 'enrolled-courses/' + courseId);
  }

  // ne koristi se nigde - imalo bi smisla da se koristi
  getCourses() {
    return this.http.get<Course[]>(environment.apiHost + 'enrolled-courses');
    // return this.http.get<any[]>(environment.apiHost + 'learners/courses');
  }

  // getUnitsByEnrollmentStatus(courseId: number): Observable<Unit[]> {
  //   return this.http.get<Unit[]>(
  //     environment.apiHost + 'enrolled-courses/' + courseId
  //     // environment.apiHost + 'learners/units/' + courseId
  //   );
  // }

  getUnit(unitId: number): Observable<Unit> {
    return this.http
      .get<Unit>(environment.apiHost + 'learning/units/' + unitId);
  }

  getKnowledgeComponent(kcId: number): Observable<KnowledgeComponent> {
    return this.http.get<KnowledgeComponent>(
        environment.apiHost + 'learning/knowledge-component/' + kcId
      );
  }

  getSuitableAssessmentItem(kcId: number): Observable<LearningObject> {
    return this.http
      .get<LearningObject>(
        environment.apiHost +
          'learning/knowledge-component/' +
          kcId +
          '/assessment-item'
      )
      .pipe(map((ae) => this.learningObjectMapper.convert(ae)));
  }

  getInstructionalItems(kcId: number): Observable<LearningObject[]> {
    return this.http
      .get<LearningObject[]>(
        environment.apiHost +
          'learning/knowledge-component/' +
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
        environment.apiHost + 'learning/statistics/kcm/' + kcId
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
        'learning/session/' +
        kcId +
        '/launch',
      null
    );
  }

  terminateSession(kcId: number): Observable<unknown> {
    return this.http.post(
      environment.apiHost +
        'learning/session/' +
        kcId +
        '/terminate',
      null
    );
  }
}
