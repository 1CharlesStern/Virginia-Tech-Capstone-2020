import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminService } from './admin.service';

/*
  Prevents unauthorized access to /admin resources.  Unauthorized users
  are redirected to the administrator login page.

  Only token expiration date is checked, which can be easily spoofed.  However,
  without a valid token, users will be unable to access certain
  destructive API requests.
*/
@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate, CanActivateChild {

  constructor(private service: AdminService, private router: Router) { }

  /*
    Triggers when /admin is requested
  */
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let token = localStorage.getItem('token')
      let expiration = new Date(parseInt(localStorage.getItem('expiration')))
      //If the time value is less than the current time, pass
      if ((new Date()).valueOf() < expiration.valueOf()){
        return true
      }
      //Otherwise, login for a new token
      else {
        return this.router.parseUrl('/login')
      }
  }
  /*
    Triggers when a subset of /admin is requested
  */
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(next, state)
  }

}
