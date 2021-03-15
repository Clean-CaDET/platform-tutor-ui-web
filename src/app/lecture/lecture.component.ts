import {Component, Input, OnInit} from '@angular/core';
import { KnowledgeNode } from './knowledge-node/model/knowledge-node.model';
import { Text } from './knowledge-node/learning-objects/text/model/text.model';
import { LectureService } from './services/lecture.service';

@Component({
  selector: 'cc-lecture',
  templateUrl: './lecture.component.html',
  styleUrls: ['./lecture.component.css']
})
export class LectureComponent implements OnInit {

  @Input() private title: string;
  @Input() private subtitle: string;
  @Input() knowledgeNodes: KnowledgeNode[];


  constructor(private lectureService: LectureService) {
  }

  ngOnInit(): void {
    this.knowledgeNodes = this.lectureService.getLecture();
  }

}
