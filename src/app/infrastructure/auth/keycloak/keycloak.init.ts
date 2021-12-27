import {KeycloakService} from 'keycloak-angular';
import {environment, keycloakConfig} from '../../../../environments/environment';

export function initializeKeycloak(keycloak: KeycloakService): () => void {
  if (environment.isKeycloakOn) {
    return () =>
      keycloak.init(keycloakConfig);
  }
  return () => {
  };
}
