import {Component, OnInit} from '@angular/core';
import {LectureModel} from '../models/lecture-model';
import {KnowledgeType} from '../../content/knowledge-node/model/knowledge-type.enum';
import {CreateKnowledgeNodeService} from './create-knowledge-node.service';
import {KnowledgeNode} from '../../content/knowledge-node/model/knowledge-node.model';

@Component({
  selector: 'cc-teacher-create-knowledge-node',
  templateUrl: './teacher-create-knowledge-node.component.html',
  styleUrls: ['./teacher-create-knowledge-node.component.css']
})
export class TeacherCreateKnowledgeNodeComponent implements OnInit {
  lectures: LectureModel[];
  selectedLecture = new LectureModel();
  selectedType: KnowledgeType;
  KnowledgeType = KnowledgeType;
  teacherId = 1;
  knowledgeNodeToBeCreated = new KnowledgeNode();

  constructor(private createKnowledgeNodeService: CreateKnowledgeNodeService) {
  }

  ngOnInit(): void {
    this.getLectures();
  }

  getLectures(): void {
    this.lectures = this.createKnowledgeNodeService.getLectures(this.teacherId);
  }

  onLectureSelectionChange(lecture: LectureModel): void {
    this.selectedLecture = lecture;
    this.knowledgeNodeToBeCreated.lectureId = lecture.id;
  }

  onTypeSelectionChange(type: number): void {
    this.selectedType = type;
    this.knowledgeNodeToBeCreated.type = type;
  }

  createKnowledgeNode(): void {
    this.createKnowledgeNodeService.createKnowledgeNode(this.knowledgeNodeToBeCreated);
  }
}
