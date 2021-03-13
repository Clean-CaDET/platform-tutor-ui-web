import {Component, Input, OnInit} from '@angular/core';
import { KnowledgeNode } from './knowledge-node/model/knowledge-node.model';

@Component({
  selector: 'cc-lecture',
  templateUrl: './lecture.component.html',
  styleUrls: ['./lecture.component.css']
})
export class LectureComponent implements OnInit {

  @Input() private title: string;
  @Input() private subtitle: string;
  @Input() knowledgeNodes: KnowledgeNode[];


  constructor() {
    this.title = 'Cohesion';
    this.subtitle = null;
    this.knowledgeNodes = [];

    const node = new KnowledgeNode();
    node.learningObjects = [];

    this.knowledgeNodes.push(node);
  }

  ngOnInit(): void {
  }

}
