import { TestBed } from '@angular/core/testing';

import { ArrangeTaskService } from './arrange-task.service';

describe('ArrangeTaskService', () => {
  let service: ArrangeTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArrangeTaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
