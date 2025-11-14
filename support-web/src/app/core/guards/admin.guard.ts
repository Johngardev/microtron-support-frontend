import { Injectable } from '@angular/core';
import { CanActivate, CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable, take, map } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.currentUser$.pipe(
      take(1),
      map(user => {
        // Verifica si el usuario está autenticado y tiene rol de administrador
        const isAdmin = user && user.role === 'admin';
        
        if (isAdmin) {
          return true;
        }
        
        // Redirige al dashboard si no es administrador
        return this.router.createUrlTree(['/admin/dashboard']);
      })
    );
  }
}