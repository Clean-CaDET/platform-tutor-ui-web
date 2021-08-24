import {TestBed} from '@angular/core/testing';

import {LearningObjectSummaryService} from './learning-object-summary.service';

describe('LearningObjectSummaryService', () => {
  let service: LearningObjectSummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LearningObjectSummaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
