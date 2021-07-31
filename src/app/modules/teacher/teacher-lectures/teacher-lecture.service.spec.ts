import { TestBed } from '@angular/core/testing';

import { TeacherLectureService } from './teacher-lecture.service';

describe('TeacherLectureService', () => {
  let service: TeacherLectureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeacherLectureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
