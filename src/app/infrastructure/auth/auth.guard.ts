import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './auth.service';
import { TokenStorage } from './jwt/token.service';
import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private tokenStorage: TokenStorage,
    private authService: AuthenticationService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const user: User = this.authService.user$.getValue();

    if (user === null) {
      this.router.navigate(['login']);
      return false;
    }
    if (!route.data.role.includes(user.role)) {
      this.router.navigate(['home']);
      return false;
    }
    return true;
  }
}
