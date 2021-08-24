import {Injectable} from '@angular/core';
import {LectureModel} from '../models/lecture-model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {KnowledgeNode} from '../../content/knowledge-node/model/knowledge-node.model';


@Injectable({
  providedIn: 'root'
})
export class CreateKnowledgeNodeService {

  constructor(private http: HttpClient) {
  }

  getLectures(teacherId: number): LectureModel[] {
    // TODO: this is hardcoded, use function from feature/teacher branch
    // return this.http.get<LectureModel[]>(environment.apiHost + 'content/lecture/teacher/' + teacherId.toString());
    let a: LectureModel[];
    a = [
      new LectureModel({id: 1, name: 'Lecture1'}),
      new LectureModel({id: 2, name: 'Lecture2'}),
      new LectureModel({id: 3, name: 'Lecture3'})
    ];
    return a;
  }

  createKnowledgeNode(knowledgeNodeToBeCreated: KnowledgeNode): void {
    this.http.post<KnowledgeNode>(environment.apiHost + 'content/knowledgeNode', knowledgeNodeToBeCreated).subscribe(
      data => console.log(data),
      error => alert(error.error),
    );
  }
}
