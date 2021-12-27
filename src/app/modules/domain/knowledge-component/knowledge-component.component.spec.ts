import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowledgeComponentComponent } from './knowledge-component.component';

describe('KnowledgeComponentComponent', () => {
  let component: KnowledgeComponentComponent;
  let fixture: ComponentFixture<KnowledgeComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KnowledgeComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KnowledgeComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
