import { Component, Input, OnInit } from '@angular/core';
import { LearningObject } from './learning-objects/model/learning-object.model';

@Component({
  selector: 'cc-knowledge-node',
  templateUrl: './knowledge-node.component.html',
  styleUrls: ['./knowledge-node.component.css']
})
export class KnowledgeNodeComponent implements OnInit {

  @Input() learningObjects: LearningObject[];

  constructor() { }

  ngOnInit(): void {
  }

}
