import { Component, AfterViewInit, OnInit, ViewChild, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
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
  imports: [MatTableModule, MatTabsModule, MatFormFieldModule, MatInputModule, DatePipe, RouterLink],
  templateUrl: './incidents.component.html',
  styleUrl: './incidents.component.css'
})
export class IncidentsComponent implements OnInit, AfterViewInit {
  private _dialog = inject(MatDialog);
  private _incidentService = inject(IncidentService);

  displayedColumns: string[] = ['id', 'status', 'product', 'title', 'admin', 'priority', 'creationDate'];

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
  }

  //--- Filtrado ---
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // --- Filtrado por estado (usando el servicio) ---
  filterByStatus(status: IncidentStatus): void {
    this._incidentService.getAllIncidents({ status: status }).subscribe(data => {
      this.dataSource.data = data;
      // Re-aplica el filtro de texto si existe
      if (this.dataSource.filter) {
        this.dataSource.filter = this.dataSource.filter;
      }
    });
  }

  // --- Carga de estadísticas (usando el servicio) ---
  loadStats(): void {
    this._incidentService.getIncidentStats().subscribe(stats => {
      this.totalIncidents = stats.total;
      this.totalOpenIncidents = stats.open;
      this.totalClosedIncidents = stats.closed;
    });
  }

}
 