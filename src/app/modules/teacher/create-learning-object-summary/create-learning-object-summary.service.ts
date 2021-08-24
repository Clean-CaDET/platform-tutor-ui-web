import {Injectable} from '@angular/core';
import {LearningObject} from '../../content/learning-objects/model/learning-object.model';
import {LearningObjectMapper} from '../../content/learning-objects/learning-object-mapper';
import {HttpClient} from '@angular/common/http';
import {LearningObjectSummary} from '../../content/learning-object-summary/model/learning-object-summary';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CreateLearningObjectSummaryService {

  constructor(private learningObjectMapper: LearningObjectMapper, private http: HttpClient) {
  }

  mapNodeLearningObjects(los: LearningObject[]): LearningObject[] {
    return los.map(lo => this.learningObjectMapper.convert(lo));
  }

  createLearningObjectSummary(learningObjectSummary: LearningObjectSummary): void {
    this.http.post(environment.apiHost + 'content/learningObjectSummary', learningObjectSummary).subscribe(value => console.log(value));
  }
}
