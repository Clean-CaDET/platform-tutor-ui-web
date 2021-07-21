import { TestBed } from '@angular/core/testing';

import { LearnerService } from './learner.service';

describe('LearnerService', () => {
  let service: LearnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LearnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
