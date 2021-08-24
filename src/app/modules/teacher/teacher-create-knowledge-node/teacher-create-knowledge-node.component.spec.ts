import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TeacherCreateKnowledgeNodeComponent} from './teacher-create-knowledge-node.component';

describe('TeacherCreateKnowledgeNodeComponent', () => {
  let component: TeacherCreateKnowledgeNodeComponent;
  let fixture: ComponentFixture<TeacherCreateKnowledgeNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeacherCreateKnowledgeNodeComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherCreateKnowledgeNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
