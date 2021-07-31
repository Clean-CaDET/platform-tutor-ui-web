import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherSubscribeComponent } from './teacher-subscribe.component';

describe('TeacherSubscribeComponent', () => {
  let component: TeacherSubscribeComponent;
  let fixture: ComponentFixture<TeacherSubscribeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherSubscribeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherSubscribeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
