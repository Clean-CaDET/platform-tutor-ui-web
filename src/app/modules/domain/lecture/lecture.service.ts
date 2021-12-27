import {Injectable} from '@angular/core';
import {KnowledgeNode} from '../knowledge-node/model/knowledge-node.model';
import {Lecture} from './model/lecture.model';
import {environment} from '../../../../environments/environment';
import {Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map, tap} from 'rxjs/operators';
import {LearningObjectMapper} from '../learning-objects/learning-object-mapper';

@Injectable({
  providedIn: 'root'
})
export class LectureService {
  lectures: Lecture[];

  constructor(private http: HttpClient, private learningObjectMapper: LearningObjectMapper) {
  }

  getLectures(): Observable<Lecture[]> {
    if (this.lectures) return of(this.lectures);
    return this.http.get<Lecture[]>(environment.apiHost + 'lectures').pipe(tap(lectures => this.lectures = lectures));
  }

  getLecture(id: number): Observable<KnowledgeNode[]> {
    return this.http.get<KnowledgeNode[]>(environment.apiHost + 'nodes/' + id)
      .pipe(map(nodes => nodes.map(node => this.mapNodeLearningObjects(node))));
  }

  getKnowledgeNode(id: number): Observable<KnowledgeNode> {
    return this.http.get<KnowledgeNode>(environment.apiHost + 'nodes/domain/' + id)
      .pipe(map(node => this.mapNodeLearningObjects(node)));
  }

  mapNodeLearningObjects(knowledgeNode: KnowledgeNode): KnowledgeNode {
    knowledgeNode.learningObjects = knowledgeNode.learningObjects.map(lo => this.learningObjectMapper.convert(lo));
    return knowledgeNode;
  }
}
