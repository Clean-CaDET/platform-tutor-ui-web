import {TestBed} from '@angular/core/testing';

import {CreateLearningObjectSummaryService} from './create-learning-object-summary.service';

describe('CreateLearningObjectSummaryService', () => {
  let service: CreateLearningObjectSummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateLearningObjectSummaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
