import { TestBed } from '@angular/core/testing';

import { TeacherCoursesService } from './teacher-courses.service';

describe('TeacherCoursesServiceService', () => {
  let service: TeacherCoursesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeacherCoursesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
