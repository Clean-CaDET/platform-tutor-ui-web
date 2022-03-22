import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Unit} from './unit.model';
import {environment} from '../../../../environments/environment';
import {KnowledgeComponent} from '../knowledge-component/model/knowledge-component.model';
import {LearningObjectMapper} from '../learning-objects/learning-object-mapper';
import {LearningObject} from '../learning-objects/learning-object.model';
import {query} from '@angular/animations';
import {KCMastery} from '../knowledge-component/model/knowledge-component-mastery.model';
import { NullVisitor } from '@angular/compiler/src/render3/r3_ast';


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

  getKnowledgeComponentMastery(kcId: number): Observable<KCMastery> {
    return this.http.get<KCMastery>(environment.apiHost + 'units/knowledge-components/mastery/' + kcId)
      .pipe(map(kcm => new KCMastery(kcm)));
  }

  mapLearningObjects(instructionalEvents: LearningObject[]): LearningObject[] {
    instructionalEvents = instructionalEvents.map(ie => this.learningObjectMapper.convert(ie));
    return instructionalEvents;
  }

  launchSession(kcId: number) : void {
    this.http.post(environment.apiHost + 'units/knowledge-components/' + kcId + '/session/launch', null)
      .subscribe(() => console.log("launched!"));
  }

  terminateSession(kcId: number) : void {
    this.http.post(environment.apiHost + 'units/knowledge-components/' + kcId + '/session/terminate', null)
      .subscribe(() => console.log("terminated!"));
  }
}
