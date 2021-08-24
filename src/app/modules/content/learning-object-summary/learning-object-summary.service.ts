import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LearningObject} from '../learning-objects/model/learning-object.model';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {LearningObjectMapper} from '../learning-objects/learning-object-mapper';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LearningObjectSummaryService {

  constructor(private http: HttpClient, private learningObjectMapper: LearningObjectMapper) {
  }

  getLearningObjects(losId: number): Observable<LearningObject[]> {
    return this.http.get<LearningObject[]>(environment.apiHost + 'content/learningObjectsBySummaries/' + losId.toString())
      .pipe(map(nodes => this.mapNodeLearningObjects(nodes)));
  }

  mapNodeLearningObjects(los: LearningObject[]): LearningObject[] {
    return los.map(lo => this.learningObjectMapper.convert(lo));
  }
}
