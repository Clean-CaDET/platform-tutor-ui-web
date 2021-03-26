import { Component, Input, OnInit } from '@angular/core';
import { KnowledgeNode } from './model/knowledge-node.model';
import { LearningObjectConverter } from './learning-objects/learning-object-converter';
import { ActivatedRoute, Params } from '@angular/router';
import { LectureService } from '../services/lecture.service';

@Component({
  selector: 'cc-knowledge-node',
  templateUrl: './knowledge-node.component.html',
  styleUrls: ['./knowledge-node.component.css']
})
export class KnowledgeNodeComponent implements OnInit {

  knowledgeNode: KnowledgeNode;


  constructor(
    public converter: LearningObjectConverter,
    private route: ActivatedRoute,
    private lectureService: LectureService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.lectureService.getKnowledgeNode(+params.nodeId)
        .subscribe(node => {
          this.knowledgeNode = node;
        });
    });
  }

}
