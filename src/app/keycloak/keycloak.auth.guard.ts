import {Injectable} from '@angular/core';
import {KeycloakAuthGuard, KeycloakService} from 'keycloak-angular';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class KeycloakGuard extends KeycloakAuthGuard {
  constructor(
    protected readonly router: Router,
    protected readonly keycloak: KeycloakService
  ) {
    super(router, keycloak);
  }

  public async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {

    if (!this.authenticated) {
      await this.keycloak.login();
    }

    return await this.keycloak.getToken() != null;
  }
}
