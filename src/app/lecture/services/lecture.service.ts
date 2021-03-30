import { Injectable } from '@angular/core';
import { KnowledgeNode } from '../knowledge-node/model/knowledge-node.model';
import { Lecture } from '../model/lecture.model';
import { ContentNode } from '../../home/navbar/navbar.component';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { LearningObjectMapper } from './learning-object-mapper';

@Injectable({
  providedIn: 'root'
})
export class LectureService {

  constructor(private http: HttpClient, private learningObjectMapper: LearningObjectMapper) {
  }

  getLectures(): Observable<Lecture[]> {
    return this.http.get<Lecture[]>(environment.apiHost + 'lecture/all');
  }

  getLecture(id: number): Observable<KnowledgeNode[]> {
    return this.http.get<KnowledgeNode[]>(environment.apiHost + 'lecture/nodes/' + id)
      .pipe(map(nodes => nodes.map(node => this.mapNodeLearningObjects(node))));
  }

  getKnowledgeNode(id: number): Observable<KnowledgeNode> {
    return this.http.get<KnowledgeNode>(environment.apiHost + 'lecture/content/' + id)
      .pipe(map(node => this.mapNodeLearningObjects(node)));
  }

  getLectureRoutes(): Observable<ContentNode[]> {
    return this.getLectures().pipe(
      map(lectures => lectures.map(lecture => ({ name: lecture.name, link: '/lecture/' + lecture.id, data: lecture })))
    );
  }

  mapNodeLearningObjects(knowledgeNode: KnowledgeNode): KnowledgeNode {
    knowledgeNode.learningObjects = knowledgeNode.learningObjects.map(lo => this.learningObjectMapper.convert(lo));
    return knowledgeNode;
  }
}
