import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateLearningObjectSummaryComponent} from './create-learning-object-summary.component';

describe('CreateLearningObjectSummaryComponent', () => {
  let component: CreateLearningObjectSummaryComponent;
  let fixture: ComponentFixture<CreateLearningObjectSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateLearningObjectSummaryComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLearningObjectSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
