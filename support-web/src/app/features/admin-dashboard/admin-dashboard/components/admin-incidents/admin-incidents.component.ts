import { Component, inject, ViewChild } from '@angular/core';
import { Incident } from '../../../../../core/models/incident.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { IncidentService } from '../../../../../core/services/incident.service';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DatePipe } from '@angular/common';
import { RouterLink } from "@angular/router";
import { IncidentStatus } from '../../../../dashboard/components/incidents/incidents.component';

@Component({
  selector: 'app-admin-incidents',
  standalone: true,
  imports: [MatTableModule, MatTabsModule, MatFormFieldModule, MatInputModule, DatePipe, RouterLink],
  templateUrl: './admin-incidents.component.html',
  styleUrl: './admin-incidents.component.css'
})
export class AdminIncidentsComponent {
  private _incidentService = inject(IncidentService);

  displayedColumns: string[] = ['id', 'product', 'title', 'admin', 'priority', 'status'];

  dataSource = new MatTableDataSource<Incident>();

  @ViewChild(MatSort) sort!: MatSort;

  totalIncidents: number = 0;
  totalOpenIncidents: number = 0;
  totalClosedIncidents: number = 0;

  ngOnInit(): void {
  this.loadStats();
  // First try loading all incidents
  this.loadAllIncidents();
  // Then try filtering by status
  setTimeout(() => {
    this.filterByStatus(IncidentStatus.OPEN);
  }, 1000);
}

  ngAfterViewInit(): void {
    // Conectar el ordenador a la fuente de datos
    this.dataSource.sort = this.sort;
  }

  //--- Filtrado ---
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // --- Filtrado por estado (usando el servicio) ---
  filterByStatus(status: IncidentStatus): void {

    // Try with the status as is first
    this._incidentService.getAllIncidents({ status: status }).subscribe({
      next: (data) => {
        this.dataSource.data = data;
        if (this.dataSource.filter) {
          this.dataSource.filter = this.dataSource.filter;
        }
      }
    });
  }

  // Helper method to translate status to English
  private translateStatusToEnglish(status: string): string | null {
    const statusMap: { [key: string]: string } = {
      'abierto': 'open',
      'en progreso': 'in_progress',
      'cerrado': 'closed',
      'resuelto': 'resolved'
    };
    return statusMap[status.toLowerCase()] || null;
  }

  // --- Carga de estadísticas (usando el servicio) ---
  loadStats(): void {
    this._incidentService.getIncidentStats().subscribe(stats => {
      this.totalIncidents = stats.total;
      this.totalOpenIncidents = stats.open;
      this.totalClosedIncidents = stats.closed;
    });
  }

  loadAllIncidents(): void {
  this._incidentService.getAllIncidents().subscribe({
    next: (data) => {
      this.dataSource.data = data;
    },
    error: (error) => {
      console.error('Error loading all incidents:', error);
    }
  });
}

}
