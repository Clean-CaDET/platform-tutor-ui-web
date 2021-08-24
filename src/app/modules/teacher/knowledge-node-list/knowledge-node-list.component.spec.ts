import {ComponentFixture, TestBed} from '@angular/core/testing';

import {KnowledgeNodeListComponent} from './knowledge-node-list.component';

describe('KnowledgeNodeListComponent', () => {
  let component: KnowledgeNodeListComponent;
  let fixture: ComponentFixture<KnowledgeNodeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KnowledgeNodeListComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KnowledgeNodeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
