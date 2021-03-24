import { Component, Input, OnInit } from '@angular/core';
import { KnowledgeNode } from './model/knowledge-node.model';
import { LearningObjectConverter } from './learning-objects/learning-object-converter';

@Component({
  selector: 'cc-knowledge-node',
  templateUrl: './knowledge-node.component.html',
  styleUrls: ['./knowledge-node.component.css']
})
export class KnowledgeNodeComponent implements OnInit {

  @Input() knowledgeNode: KnowledgeNode;

  constructor(public converter: LearningObjectConverter) { }

  ngOnInit(): void {
  }

}
