import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {KeycloakAuthGuard, KeycloakService} from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard extends KeycloakAuthGuard {
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
