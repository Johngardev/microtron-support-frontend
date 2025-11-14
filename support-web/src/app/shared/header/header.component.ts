import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AsyncPipe, CommonModule } from '@angular/common';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule, AsyncPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private _router = inject(Router);
  private _authService = inject(AuthService);

  currentUser$ = this._authService.currentUser$;
  isAuthenticated= this._authService.isAuthenticated();

  isAdmin(role: string): boolean {
    return role === 'admin';
  }

  onLogout(): void {
    this._authService.logout();
    this._router.navigate(['/login']);
  }

}
