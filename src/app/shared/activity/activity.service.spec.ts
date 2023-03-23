import { TestBed } from '@angular/core/testing';

import { LearnerActivityService } from './learner-activity.service';

describe('ActivityService', () => {
  let service: LearnerActivityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LearnerActivityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
