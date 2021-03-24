import { Injectable } from '@angular/core';
import { KnowledgeNode } from '../knowledge-node/model/knowledge-node.model';
import { Text } from '../knowledge-node/learning-objects/text/model/text.model';
import { LearningObjectRole } from '../knowledge-node/learning-objects/enum/learning-object-role.enum';
import { Image } from '../knowledge-node/learning-objects/image/model/image.model';
import { Video } from '../knowledge-node/learning-objects/video/model/video.model';
import { Lecture } from '../model/lecture.model';
import { ContentNode } from '../../home/navbar/navbar.component';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LectureService {

  constructor(private http: HttpClient) { }

  getLectures(): Observable<Lecture[]> {
    return this.http.get<Lecture[]>(environment.apiHost + 'lecture/all');
  }

  getLecture(id: number): Observable<Lecture> {
    return this.http.get<Lecture>(environment.apiHost + 'lecture/get/' + id);
  }

  getLectureRoutes(): Observable<ContentNode[]> {
    return this.getLectures().pipe(
      map(lectures => lectures.map(lecture => ({ name: lecture.name, link: '/lecture/' + lecture.id })))
    );
  }
}
