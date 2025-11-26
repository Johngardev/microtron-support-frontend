import { Component, inject } from '@angular/core';
import { Session } from '../../../../../core/models/session.model';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from '../../../../../core/services/session.service';
import { RouterLink } from '@angular/router';
import { DatePipe, CommonModule } from '@angular/common';
import { AuthService } from '../../../../../core/services/auth.service';
import { AsyncPipe } from '@angular/common';
import { NotificationService } from '../../../../../core/services/notification.service';

@Component({
  selector: 'app-admin-session',
  standalone: true,
  imports: [RouterLink, DatePipe, CommonModule, AsyncPipe],
  templateUrl: './admin-session.component.html',
  styleUrl: './admin-session.component.css'
})
export class AdminSessionComponent {
  session: Session | undefined;
  private _authService = inject(AuthService);
  currentUser$ = this._authService.currentUser$;
  isUpdating = false;

  constructor(
    private _sessionService: SessionService,
    private _route: ActivatedRoute,
    private _notification: NotificationService,
  ) { }

  ngOnInit(): void {
    // Obtenemos el ID de la URL
    const id = this._route.snapshot.paramMap.get('id');
    if (id) {
      this._sessionService.getSessionById(id).subscribe(data => {
        this.session = data;
      });
    }
  }

  closeSesssion(): void {
    if (!this.session) { return; }
    if (this.session.status === 'Cerrado') {
      this._notification.show({ id: 'info-closed', message: 'La sesión ya está cerrada.', type: 'info' });
      return;
    }
    this.isUpdating = true;
    this._sessionService.updateSession(this.session.id, {status: "Cerrado"}).subscribe({
      next: updated => {
        this.session = { ...this.session!, ...updated };
        this._notification.show({ id: 'closed', message: 'Sesion cerrada correctamente.', type: 'success'});
        this.isUpdating = false;
      },
      error: err => {
        console.error('Error closing session', err);
        this._notification.show({ id: 'err-close', message: 'Error al cerrar la solicitud de sesion.', type: 'error'});
        this.isUpdating = false;
      }
    })
  }

}
