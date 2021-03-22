import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowledgeNodeComponent } from './knowledge-node.component';

describe('KnowledgeNodeComponent', () => {
  let component: KnowledgeNodeComponent;
  let fixture: ComponentFixture<KnowledgeNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KnowledgeNodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KnowledgeNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
