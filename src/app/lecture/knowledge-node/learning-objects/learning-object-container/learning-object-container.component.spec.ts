import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningObjectContainerComponent } from './learning-object-container.component';

describe('LearningObjectComponent', () => {
  let component: LearningObjectContainerComponent;
  let fixture: ComponentFixture<LearningObjectContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LearningObjectContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LearningObjectContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
