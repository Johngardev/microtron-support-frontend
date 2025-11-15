import { Component, inject } from '@angular/core';
import { Session } from '../../../../../core/models/session.model';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from '../../../../../core/services/session.service';
import { RouterLink } from '@angular/router';
import { DatePipe, CommonModule } from '@angular/common';
import { AuthService } from '../../../../../core/services/auth.service';
import { AsyncPipe } from '@angular/common';

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

  constructor(
    private _sessionService: SessionService,
    private _route: ActivatedRoute,
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

}
