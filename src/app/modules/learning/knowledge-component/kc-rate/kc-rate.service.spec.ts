import { TestBed } from '@angular/core/testing';

import { KcRateService } from './kc-rate.service';

describe('KcRateService', () => {
  let service: KcRateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KcRateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
