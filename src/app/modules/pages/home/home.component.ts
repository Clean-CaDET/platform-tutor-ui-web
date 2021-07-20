import { Component, OnInit } from '@angular/core';
import { Lecture } from 'src/app/model/lecture/lecture.model';
import { LectureService } from 'src/app/modules/lecture/lecture.service';

@Component({
  selector: 'cc-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  lectures: Lecture[];

  constructor(private lectureService: LectureService) { }

  ngOnInit(): void {
    this.lectureService.getLectures().subscribe(lectures => this.lectures = lectures);
  }

}
