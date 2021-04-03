import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeycloakComponent } from './keycloak.component';

describe('KeycloakComponent', () => {
  let component: KeycloakComponent;
  let fixture: ComponentFixture<KeycloakComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeycloakComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeycloakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
