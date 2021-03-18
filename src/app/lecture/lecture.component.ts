import {Component, Input, OnInit} from '@angular/core';
import { KnowledgeNode } from './knowledge-node/model/knowledge-node.model';
import { Text } from './knowledge-node/learning-objects/text/model/text.model';
import { LectureService } from './services/lecture.service';
import { Lecture } from './model/lecture.model';

@Component({
  selector: 'cc-lecture',
  templateUrl: './lecture.component.html',
  styleUrls: ['./lecture.component.css']
})
export class LectureComponent implements OnInit {

  @Input() lecture: Lecture;

  constructor(private lectureService: LectureService) {
  }

  ngOnInit(): void {
    this.lecture = this.lectureService.getLecture();
  }

}
