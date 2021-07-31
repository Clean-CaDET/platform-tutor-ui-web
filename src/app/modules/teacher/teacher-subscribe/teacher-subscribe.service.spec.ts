import { TestBed } from '@angular/core/testing';

import { TeacherSubscribeService } from './teacher-subscribe.service';

describe('TeacherSubscribeService', () => {
  let service: TeacherSubscribeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeacherSubscribeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
