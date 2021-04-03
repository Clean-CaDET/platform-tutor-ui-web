import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrangeTaskComponent } from './arrange-task.component';

describe('ArrangeTaskComponent', () => {
  let component: ArrangeTaskComponent;
  let fixture: ComponentFixture<ArrangeTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArrangeTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrangeTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
