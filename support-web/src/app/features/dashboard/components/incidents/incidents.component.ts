import { Component, AfterViewInit, OnInit, ViewChild, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { Incident } from '../../../../core/models/incident.model';
import { MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CreateIncidentComponent } from '../../../../shared/create-incident/create-incident.component';
import { IncidentService } from '../../../../core/services/incident.service';
import { AuthService } from '../../../../core/services/auth.service';
import { UserRole } from '../../../../core/models/user.model';
import { RouterLink } from "@angular/router";

export enum IncidentStatus {
  OPEN = 'Abierto',
  IN_PROGRESS = 'En Proceso',
  RESOLVED = 'Resuelto',
  CLOSED = 'Cerrado',
  ALL = 'Todos'
}

@Component({
  selector: 'app-incidents',
  standalone: true,
  imports: [MatTableModule, MatTabsModule, MatFormFieldModule, MatInputModule, DatePipe, RouterLink, CommonModule],
  templateUrl: './incidents.component.html',
  styleUrl: './incidents.component.css'
})
export class IncidentsComponent implements OnInit, AfterViewInit {
  private _dialog = inject(MatDialog);
  private _incidentService = inject(IncidentService);
  private _authService = inject(AuthService);

  displayedColumns: string[] = ['id', 'status', 'product', 'title', 'admin', 'priority', 'creationDate', 'assignedTo'];
  // Método para saber si el usuario actual es admin
  isAdmin(): boolean {
    const user = this._authService.currentUserValue;
    return user && user.role === UserRole.ADMIN;
  }

  // Método para atender incidente (asignar al admin actual)
  atenderIncidente(incident: Incident): void {
    const user = this._authService.currentUserValue;
    if (!user || user.role !== UserRole.ADMIN) return;
    this._incidentService.updateIncident(incident._id, { assignedTo: user._id }).subscribe({
      next: (updated) => {
        // Actualizar la tabla localmente
        incident.assignedTo = { _id: user._id, name: user.name, email: user.email };
      },
      error: (err) => {
        // Manejo de error (opcional: notificación)
        console.error('Error asignando incidente:', err);
      }
    });
  }

  dataSource = new MatTableDataSource<Incident>();

  @ViewChild(MatSort) sort!: MatSort;

  totalIncidents: number = 0;
  totalOpenIncidents: number = 0;
  totalClosedIncidents: number = 0;

  openDialog(): void {
    const dialogRef = this._dialog.open(CreateIncidentComponent);
  }

  ngOnInit(): void {
    this.loadStats();
    this.filterByStatus(IncidentStatus.OPEN);
  }

  ngAfterViewInit(): void {
    // Conectar el ordenador a la fuente de datos
    this.dataSource.sort = this.sort;
    // Debug: listar columnas esperadas y las definidas en el DOM
    try {
      const defined = Array.from(document.querySelectorAll('[matColumnDef]')).map(el => el.getAttribute('matColumnDef'));
    } catch (e) {
      // ignore
    }
  }

  //--- Filtrado ---
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // --- Filtrado por estado (usando el servicio) ---
  filterByStatus(status: IncidentStatus): void {
    this._incidentService.getAllIncidents({ status: status }).subscribe(data => {
      // Si el usuario actual tiene rol 'user', mostrar solo los incidentes creados por él
      const currentUser = this._authService.currentUserValue;
      if (currentUser && currentUser.role === UserRole.USER) {
        this.dataSource.data = data.filter(i => i.createdBy && i.createdBy._id === currentUser._id);
      } else {
        // administradores u otros roles ven todos
        this.dataSource.data = data;
      }
      // Re-aplica el filtro de texto si existe
      if (this.dataSource.filter) {
        this.dataSource.filter = this.dataSource.filter;
      }
    });
  }

  // --- Carga de estadísticas (usando el servicio) ---
  loadStats(): void {
    const currentUser = this._authService.currentUserValue;
    if (currentUser && currentUser.role === UserRole.USER) {
      // Solicitar estadísticas filtradas por el usuario actual
      this._incidentService.getIncidentStats({ createdBy: currentUser._id }).subscribe(stats => {
        this.totalIncidents = stats.total;
        this.totalOpenIncidents = stats.open;
        this.totalClosedIncidents = stats.closed;
      });
    } else {
      // Administradores u otros roles ven estadísticas globales
      this._incidentService.getIncidentStats().subscribe(stats => {
        this.totalIncidents = stats.total;
        this.totalOpenIncidents = stats.open;
        this.totalClosedIncidents = stats.closed;
      });
    }
  }

}
 