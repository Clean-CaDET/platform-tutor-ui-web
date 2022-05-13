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

  getUnit(unitId: number): Observable<Unit> {
    return this.http.get<Unit>(environment.apiHost + 'units/' + unitId)
      .pipe(map(unit => new Unit(unit)));
  }

  getKnowledgeComponent(kcId: number): Observable<KnowledgeComponent> {
    return this.http.get<KnowledgeComponent>(environment.apiHost + 'units/knowledge-components/' + kcId)
      .pipe(map(kc => new KnowledgeComponent(kc)));
  }

  getInstructionalItems(kcId: number): Observable<LearningObject[]> {
    return this.http.get<LearningObject[]>(environment.apiHost + 'units/knowledge-components/' + kcId + '/instructional-items')
      .pipe(map(los => this.mapLearningObjects(los)));
  }

  getSuitableAssessmentItem(kcId: number): Observable<LearningObject> {
    return this.http.get<LearningObject>(environment.apiHost + 'units/knowledge-component/' + kcId + '/assessment-item')
      .pipe(map(ae => this.learningObjectMapper.convert(ae)));
  }

  getKnowledgeComponentStatistics(kcId: number): Observable<KnowledgeComponentStatistics> {
    return this.http.get<KnowledgeComponentStatistics>(environment.apiHost + 'units/knowledge-components/statistics/' + kcId)
      .pipe(map(knowledgeComponentStatistics => new KnowledgeComponentStatistics(knowledgeComponentStatistics)));
  }

  mapLearningObjects(instructionalItems: LearningObject[]): LearningObject[] {
    instructionalItems = instructionalItems.map(ie => this.learningObjectMapper.convert(ie));
    return instructionalItems;
  }

  launchSession(kcId: number) : Observable<unknown> {
    return this.http.post(environment.apiHost + 'units/knowledge-components/' + kcId + '/session/launch', null);
  }

  terminateSession(kcId: number) : Observable<unknown> {
    return this.http.post(environment.apiHost + 'units/knowledge-components/' + kcId + '/session/terminate', null);
  }
}
