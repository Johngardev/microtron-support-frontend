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
  isUserMenuOpen = false;

  get isAuthenticated(): boolean {
    return this._authService.isAuthenticated();
  }

  constructor() {
    // Cerrar el menú al hacer clic fuera de él
    document.addEventListener('click', this.onClickOutside.bind(this));
  }

  ngOnDestroy() {
    // Limpiar el event listener al destruir el componente
    document.removeEventListener('click', this.onClickOutside.bind(this));
  }

  isAdmin(role: string): boolean {
    return role === 'admin';
  }

  toggleUserMenu(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.isUserMenuOpen = false;
    }
  }

  onLogout(): void {
    this._authService.logout();
    this._router.navigate(['/login']);
  }

}
