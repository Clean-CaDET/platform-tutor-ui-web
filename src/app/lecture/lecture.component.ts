import {Component, Input, OnInit} from '@angular/core';
import { KnowledgeNode } from './knowledge-node/model/knowledge-node.model';
import { Text } from './knowledge-node/learning-objects/text/model/text.model';
import { LectureService } from './services/lecture.service';
import { Lecture } from './model/lecture.model';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'cc-lecture',
  templateUrl: './lecture.component.html',
  styleUrls: ['./lecture.component.css']
})
export class LectureComponent implements OnInit {

  lecture: Lecture;

  constructor(private lectureService: LectureService, private route: ActivatedRoute) {  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.lectureService.getLecture(+params.lectureId)
        .subscribe(lecture => this.lecture = lecture);
    });
  }

}
