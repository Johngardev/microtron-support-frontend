import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Incident } from '../../../../../core/models/incident.model';
import { IncidentService } from '../../../../../core/services/incident.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AsyncPipe, DatePipe } from '@angular/common';
import { RouterLink } from "@angular/router";
import { NgClass } from '@angular/common';
import { AuthService } from '../../../../../core/services/auth.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { IncidentChatComponent } from '../../../../../shared/incident-chat/incident-chat.component';

@Component({
  selector: 'app-admin-incident',
  standalone: true,
  imports: [MatTabsModule, MatFormFieldModule, MatInputModule, DatePipe, RouterLink, NgClass, IncidentChatComponent, AsyncPipe],
  templateUrl: './admin-incident.component.html',
  styleUrl: './admin-incident.component.css'
})
export class AdminIncidentComponent {
  incident: Incident | undefined;
  currentUser$ = inject(AuthService).currentUser$;
  isUpdating = false;

  constructor(
    private _incidentService: IncidentService,
    private _route: ActivatedRoute,
    private _notification: NotificationService,
  ) { }

  ngOnInit(): void {
    // Obtenemos el ID de la URL
    const id = this._route.snapshot.paramMap.get('id');
    if (id) {
      this._incidentService.getIncidentById(id).subscribe(data => {
        this.incident = data;
      });
    }
  }

  closeIncident(): void {
    if (!this.incident) { return; }
    if (this.incident.status === 'Cerrado') {
      this._notification.show({ id: 'info-closed', message: 'La incidencia ya está cerrada.', type: 'info' });
      return;
    }
    this.isUpdating = true;
    this._incidentService.updateIncident(this.incident._id, { status: 'Cerrado' }).subscribe({
      next: updated => {
        this.incident = { ...this.incident!, ...updated };
        this._notification.show({ id: 'closed', message: 'Incidencia cerrada correctamente.', type: 'success' });
        this.isUpdating = false;
      },
      error: err => {
        console.error('Error closing incident', err);
        this._notification.show({ id: 'err-close', message: 'Error al cerrar la incidencia.', type: 'error' });
        this.isUpdating = false;
      }
    });
  }

  reopenIncident(): void {
    if (!this.incident) { return; }
    if (this.incident.status === 'Abierto') {
      this._notification.show({ id: 'info-open', message: 'La incidencia ya está abierta.', type: 'info' });
      return;
    }
    this.isUpdating = true;
    this._incidentService.updateIncident(this.incident._id, { status: 'Abierto' }).subscribe({
      next: updated => {
        this.incident = { ...this.incident!, ...updated };
        this._notification.show({ id: 'reopened', message: 'Incidencia reabierta correctamente.', type: 'success' });
        this.isUpdating = false;
      },
      error: err => {
        console.error('Error reopening incident', err);
        this._notification.show({ id: 'err-reopen', message: 'Error al reabrir la incidencia.', type: 'error' });
        this.isUpdating = false;
      }
    });
  }




}
