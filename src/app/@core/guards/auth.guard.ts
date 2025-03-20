import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';  // Assuming you have an AuthService to check login state

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    // Check if the user is logged in
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      // Redirect the user to the login page if not authenticated
      this.router.navigate(['/auth']);
      return false;
    }
  }
}
