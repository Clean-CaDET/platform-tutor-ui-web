import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ACCESS_TOKEN, ROLE } from 'src/app/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(localStorage.getItem(ACCESS_TOKEN) == null) {
        this.router.navigate(['login']);
        return false;
      }
      if(localStorage.getItem(ROLE) != route.data.role) {
        this.router.navigate(['home']);
        return false;
      }

      return true;
  }

}
