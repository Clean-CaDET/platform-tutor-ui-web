import { Component, OnInit } from '@angular/core';
import { KnowledgeNode } from './model/knowledge-node.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LectureService } from '../lecture/lecture.service';

@Component({
  selector: 'cc-knowledge-node',
  templateUrl: './knowledge-node.component.html',
  styleUrls: ['./knowledge-node.component.css']
})
export class KnowledgeNodeComponent implements OnInit {

  knowledgeNode: KnowledgeNode;
  sidenavOpened = false;
  previousPage: { type: string; id: number; };
  nextPage: { type: string; id: number; };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private lectureService: LectureService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      let nodeId = +params.nodeId;
      this.getLearningObjects(nodeId);
      this.createPrevAndNextButtons(nodeId);
    });
  }

  private getLearningObjects(nodeId: number) {
    this.lectureService.getKnowledgeNode(nodeId).subscribe(node => {
      this.knowledgeNode = node;
    });
  }

  private createPrevAndNextButtons(nodeId: number) {
    this.previousPage = null;
    this.nextPage = null;
    this.lectureService.getLectures().subscribe(lectures => {
      let lecture = lectures.find(l => l.knowledgeNodeIds.includes(nodeId));
      let nodeIndex = lecture.knowledgeNodeIds.indexOf(nodeId);

      if (nodeIndex > 0) {
        this.previousPage = {
          type: "node",
          id: lecture.knowledgeNodeIds[nodeIndex - 1]
        }
      } else {
        let previousLectureIndex = lectures.indexOf(lecture) - 1;
        if (previousLectureIndex >= 0) {
          this.previousPage = {
            type: "lecture",
            id: lectures[previousLectureIndex].id
          }
        }
      }

      if (nodeIndex < lecture.knowledgeNodeIds.length - 1) {
        this.nextPage = {
          type: "node",
          id: lecture.knowledgeNodeIds[nodeIndex + 1]
        }
      } else {
        let nextLectureIndex = lectures.indexOf(lecture) + 1;
        if (nextLectureIndex < lectures.length) {
          this.nextPage = {
            type: "lecture",
            id: lectures[nextLectureIndex].id
          }
        }
      }
    });
  }

  changePage(url: string) {
    this.knowledgeNode = null;
    this.nextPage = null;
    this.previousPage = null;
    this.router.navigate([url]);
  }
}
