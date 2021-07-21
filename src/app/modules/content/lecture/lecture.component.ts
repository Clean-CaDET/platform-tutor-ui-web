import {Component, Input, OnInit} from '@angular/core';
import { LectureService } from './lecture.service';
import { Lecture } from './model/lecture.model';
import { ActivatedRoute, Params } from '@angular/router';
import { KnowledgeNode } from '../knowledge-node/model/knowledge-node.model';

@Component({
  selector: 'cc-lecture',
  templateUrl: './lecture.component.html',
  styleUrls: ['./lecture.component.css']
})
export class LectureComponent implements OnInit {

  lecture: Lecture;
  knowledgeNodes: KnowledgeNode[] = [];

  constructor(private lectureService: LectureService, private route: ActivatedRoute) {  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      let lectureId = +params.lectureId;
      this.lectureService.getLectures()
        .subscribe(lectures => {
          this.lecture = lectures.find(l => l.id == lectureId);
        });
      this.lectureService.getLecture(lectureId)
        .subscribe(nodes => {
          this.knowledgeNodes = nodes;
        } );
    });
  }

}
