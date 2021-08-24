import {TestBed} from '@angular/core/testing';

import {CreateKnowledgeNodeService} from './create-knowledge-node.service';

describe('CreateKnowledgeNodeService', () => {
  let service: CreateKnowledgeNodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateKnowledgeNodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
