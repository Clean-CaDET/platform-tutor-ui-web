import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Unit} from './unit.model';
import {environment} from '../../../../environments/environment';
import {KnowledgeComponent} from '../knowledge-component/model/knowledge-component.model';
import {LearningObjectMapper} from '../learning-objects/learning-object-mapper';
import {LearningObject} from '../learning-objects/learning-object.model';
import {KnowledgeComponentStatistics} from '../knowledge-component/model/knowledge-component-statistics.model';


@Injectable({
  providedIn: 'root'
})
export class UnitService {
  constructor(private http: HttpClient, private learningObjectMapper: LearningObjectMapper) {

  }

  getUnits(): Observable<Unit[]> {
    return this.http.get<Unit[]>(environment.apiHost + 'units');
  }

  getUnit(unitId: number, learnerId: number): Observable<Unit> {
    return this.http.get<Unit>(environment.apiHost + 'units/' + unitId, {params: {learnerId}})
      .pipe(map(unit => new Unit(unit)));
  }

  getKnowledgeComponent(kcId: number): Observable<KnowledgeComponent> {
    return this.http.get<KnowledgeComponent>(environment.apiHost + 'units/knowledge-components/' + kcId)
      .pipe(map(kc => new KnowledgeComponent(kc)));
  }

  getInstructionalEvents(kcId: number): Observable<LearningObject[]> {
    return this.http.get<LearningObject[]>(environment.apiHost + 'units/knowledge-components/' + kcId + '/instructional-events')
      .pipe(map(los => this.mapLearningObjects(los)));
  }

  getSuitableAssessmentEvent(knowledgeComponentId: number, learnerId: number): Observable<LearningObject> {
    const assessmentEventRequest = {knowledgeComponentId, learnerId};
    return this.http.post<LearningObject>(environment.apiHost + 'units/knowledge-component/', assessmentEventRequest)
      .pipe(map(ae => this.learningObjectMapper.convert(ae)));
  }

  getKnowledgeComponentStatistics(kcId: number): Observable<KnowledgeComponentStatistics> {
    return this.http.get<KnowledgeComponentStatistics>(environment.apiHost + 'units/knowledge-components/statistics/' + kcId)
      .pipe(map(knowledgeComponentStatistics => new KnowledgeComponentStatistics(knowledgeComponentStatistics)));
  }

  mapLearningObjects(instructionalEvents: LearningObject[]): LearningObject[] {
    instructionalEvents = instructionalEvents.map(ie => this.learningObjectMapper.convert(ie));
    return instructionalEvents;
  }
}
