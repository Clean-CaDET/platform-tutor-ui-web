import {Component, Input, OnInit} from '@angular/core';
import {KnowledgeNodeListService} from './knowledge-node-list.service';
import {KnowledgeNode} from '../../content/knowledge-node/model/knowledge-node.model';
import {KnowledgeType} from '../../content/knowledge-node/model/knowledge-type.enum';

@Component({
  selector: 'cc-knowledge-node-list',
  templateUrl: './knowledge-node-list.html',
  styleUrls: ['./knowledge-node-list.component.css']
})
export class KnowledgeNodeListComponent implements OnInit {
  @Input() lectureId: number;
  nodes: KnowledgeNode[];
  types: KnowledgeType;

  constructor(private service: KnowledgeNodeListService) {
  }

  ngOnInit(): void {
    this.service.getNodesByLecture(this.lectureId).toPromise().then(value => {
      this.nodes = value;
      this.getLosByNodes();
    });
  }

  getLosByNodes(): void {
    this.nodes.forEach(node => this.service.getLosByNode(node.id).toPromise()
      .then(value => node.learningObjectSummaries = value));
  }

}
