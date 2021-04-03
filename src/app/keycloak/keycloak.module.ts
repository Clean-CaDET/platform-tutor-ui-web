import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {KeycloakRoutingModule} from './keycloak-routing.module';
import {KeycloakComponent} from './keycloak.component';
import {environment} from '../../environments/environment';
import {KeycloakOptions, KeycloakService} from 'keycloak-angular';


@NgModule({
  declarations: [KeycloakComponent],
  imports: [
    CommonModule,
    KeycloakRoutingModule
  ]
})
export class KeycloakModule {
  constructor(private keycloakService: KeycloakService) {

    const options: KeycloakOptions = {
      config: environment.keycloakConfig
    };

    this.keycloakService
      .init(options)
      .then(() => {
        console.log('[ngDoBootstrap] bootstrap app');
      })
      .catch(error => console.error('[ngDoBootstrap] init Keycloak failed', error));
  }
}
