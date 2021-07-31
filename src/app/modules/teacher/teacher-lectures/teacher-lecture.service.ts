import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LectureModel} from '../models/lecture-model';
import {environment} from '../../../../environments/environment';
import {CreateCourseDtoModel} from '../models/create-course-dto-model';
import {CreateLectureDto} from '../models/create-lecture-dto';

@Injectable({
  providedIn: 'root'
})
export class TeacherLectureService {

  constructor(private http: HttpClient) { }

  getLectures(teacherId: number): Observable<LectureModel[]>{
    return this.http.get<LectureModel[]>(environment.apiHost + 'content/lecture/teacher/' + teacherId.toString());
  }

  createLecture(lecture: CreateLectureDto): void {
    this.http.post<CreateCourseDtoModel>(environment.apiHost + 'content/lecture', lecture).subscribe(
      data => console.log(data),
      error => alert(error.error),
    )
    ;
  }
}
