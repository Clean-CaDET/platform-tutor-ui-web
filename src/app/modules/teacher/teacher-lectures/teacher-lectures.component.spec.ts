import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TeacherLecturesComponent} from './teacher-lectures.component';

describe('TeacherLecturesComponent', () => {
  let component: TeacherLecturesComponent;
  let fixture: ComponentFixture<TeacherLecturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeacherLecturesComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherLecturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
