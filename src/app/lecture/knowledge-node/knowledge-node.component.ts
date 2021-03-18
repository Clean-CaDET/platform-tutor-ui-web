import { Component, Input, OnInit } from '@angular/core';
import { KnowledgeNode } from './model/knowledge-node.model';

@Component({
  selector: 'cc-knowledge-node',
  templateUrl: './knowledge-node.component.html',
  styleUrls: ['./knowledge-node.component.css']
})
export class KnowledgeNodeComponent implements OnInit {

  @Input() knowledgeNode: KnowledgeNode;

  constructor() { }

  ngOnInit(): void {
  }

}
