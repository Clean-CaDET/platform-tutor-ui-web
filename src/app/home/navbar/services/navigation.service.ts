import { Injectable } from '@angular/core';
import { LectureService } from '../../../lecture/services/lecture.service';
import { ContentNode } from '../navbar.component';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private lectureService: LectureService) { }

  getLectureRoutes(): ContentNode[] {
    return this.lectureService.getLectures().map(
      lecture => ({ name: lecture.name, link: '/lecture/' + lecture.id })
    );
  }
}
