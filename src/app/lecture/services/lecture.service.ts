import { Injectable } from '@angular/core';
import { KnowledgeNode } from '../knowledge-node/model/knowledge-node.model';
import { Lecture } from '../model/lecture.model';
import { ContentNode } from '../../home/navbar/navbar.component';
import { environment } from '../../../environments/environment';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LectureService {

  constructor(private http: HttpClient) { }

  getLectures(): Observable<Lecture[]> {
    return this.http.get<Lecture[]>(environment.apiHost + 'lecture/all');
  }

  getLecture(id: number): Observable<KnowledgeNode[]> {
    return this.http.get<KnowledgeNode[]>(environment.apiHost + 'lecture/nodes/' + id);
  }

  getKnowledgeNode(id: number): Observable<KnowledgeNode> {
    return this.http.get<KnowledgeNode>(environment.apiHost + 'lecture/content/' + id);
  }

  getLectureRoutes(): Observable<ContentNode[]> {
    return this.getLectures().pipe(
      map(lectures => lectures.map(lecture => ({ name: lecture.name, link: '/lecture/' + lecture.id, data: lecture })))
    );
  }

  answerQuestion(questionId: number, answerIds: number[]): Observable<any> {
    const answerDTO = {
      questionId,
      answerIds
    };
    // TODO: API call to answer a question
    return of(null);
  }
}
