import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LearningObjectSummaryComponent} from './learning-object-summary.component';

describe('LearningObjectSummaryComponent', () => {
  let component: LearningObjectSummaryComponent;
  let fixture: ComponentFixture<LearningObjectSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LearningObjectSummaryComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LearningObjectSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
