import {KeycloakOptions, KeycloakService} from 'keycloak-angular';
import {environment} from '../../../environments/environment';

export function initializeKeycloak(keycloak: KeycloakService): () => Promise<any> {
  const options: KeycloakOptions = {
    config: environment.keycloakConfig
  };
  try {
    return (): Promise<any> => keycloak.init(options);
  } catch (error) {
    console.error(error);
  }
}
