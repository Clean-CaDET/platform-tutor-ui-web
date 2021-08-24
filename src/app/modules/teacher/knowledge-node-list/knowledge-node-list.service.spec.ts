import {TestBed} from '@angular/core/testing';

import {KnowledgeNodeListService} from './knowledge-node-list.service';

describe('AddLearningObjectSummaryToNodeService', () => {
  let service: KnowledgeNodeListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KnowledgeNodeListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
