import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeycloakTestComponent } from './keycloak-test.component';

describe('KeycloakTestComponent', () => {
  let component: KeycloakTestComponent;
  let fixture: ComponentFixture<KeycloakTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeycloakTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeycloakTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
