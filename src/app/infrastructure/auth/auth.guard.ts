import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenStorage } from './jwt/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private tokenStorage: TokenStorage) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.tokenStorage.getAccessToken() == null) {
        this.router.navigate(['login']);
        return false;
      }
      if(this.tokenStorage.getUser().role != route.data.role) {
        this.router.navigate(['home']);
        return false;
      }

      return true;
  }

}
