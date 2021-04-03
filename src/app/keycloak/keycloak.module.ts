import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {KeycloakRoutingModule} from './keycloak-routing.module';
import {KeycloakComponent} from './keycloak.component';
import {environment, keycloakConfig} from '../../environments/environment';
import {KeycloakOptions, KeycloakService} from 'keycloak-angular';
import {Router} from '@angular/router';

@NgModule({
  declarations: [KeycloakComponent],
  imports: [
    CommonModule,
    KeycloakRoutingModule
  ]
})
export class KeycloakModule {
  constructor(private keycloakService: KeycloakService, private router: Router) {

    const options: KeycloakOptions = {
      config: keycloakConfig
    };

    this.keycloakService
      .init(options)
      .then(() => {
        this.router.navigate(['keycloaktest'], {}).then(() => {}); // Test for keycloak login.
      })
      .catch(error => console.error('keycloak init failed', error));
  }
}
