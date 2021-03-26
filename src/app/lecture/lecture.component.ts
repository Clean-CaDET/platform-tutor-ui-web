import {Component, Input, OnInit} from '@angular/core';
import { LectureService } from './services/lecture.service';
import { Lecture } from './model/lecture.model';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'cc-lecture',
  templateUrl: './lecture.component.html',
  styleUrls: ['./lecture.component.css']
})
export class LectureComponent implements OnInit {

  @Input() lecture: Lecture;

  constructor(private lectureService: LectureService, private route: ActivatedRoute) {  }

  ngOnInit(): void {
    this.lecture = history.state.lecture;
    history.pushState(history.state, '', '');
    this.route.params.subscribe((params: Params) => {
      this.lectureService.getLecture(+params.lectureId)
        .subscribe(nodes => {
          this.lecture.knowledgeNodes = nodes;
        } );
    });
  }

}
