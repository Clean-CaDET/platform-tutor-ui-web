import {Injectable} from '@angular/core';
import {KnowledgeNode} from '../../content/knowledge-node/model/knowledge-node.model';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {LearningObjectSummary} from '../../content/learning-object-summary/model/learning-object-summary';

@Injectable({
  providedIn: 'root'
})
export class KnowledgeNodeListService {

  constructor(private http: HttpClient) {
  }

  getNodesByLecture(lectureId: number): Observable<KnowledgeNode[]> {
    return this.http
      .get<KnowledgeNode[]>
      (environment.apiHost + 'content/lectureNodes/' + lectureId.toString());
  }

  getLosByNode(nodeId: number): Observable<LearningObjectSummary[]> {
    return this.http.get<LearningObjectSummary[]>(environment.apiHost + 'content/lectureNodes/' + nodeId.toString());
  }
}
