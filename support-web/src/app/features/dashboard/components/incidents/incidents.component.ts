import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Incident } from '../../../../core/models/incident.model';
import { MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

// --- Datos de ejemplo (esto vendría de un servicio) ---
const MOCK_INCIDENTS: Incident[] = [
  { id: 'C-1024', status: 'Cerrado', product: 'Adobe Photoshop', title: 'Error al exportar a PNG', admin: 'John Doe', priority: 'Media', creationDate: new Date('2025-09-15') },
  { id: 'C-1025', status: 'Cerrado', product: 'Autodesk AutoCAD', title: 'Fallo en la licencia de red', admin: 'Jane Smith', priority: 'Alta', creationDate: new Date('2025-09-20') },
  { id: 'C-1026', status: 'Cerrado', product: 'Microsoft 365', title: 'No se sincroniza OneDrive', admin: 'John Doe', priority: 'Baja', creationDate: new Date('2025-09-22') },
  { id: 'C-1027', status: 'Cerrado', product: 'Anydesk', title: 'Conexión remota inestable', admin: 'Peter Jones', priority: 'Media', creationDate: new Date('2025-10-01') },
];

@Component({
  selector: 'app-incidents',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './incidents.component.html',
  styleUrl: './incidents.component.css'
})
export class IncidentsComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['id', 'status', 'product', 'title', 'description', 'priority', 'creationDate', 'notificationEmails', 'attachments', 'admin', 'phoneNumber'];

  dataSource = new MatTableDataSource<Incident>();

  @ViewChild(MatSort) sort!: MatSort;

  totalIncidents: number = 0;
  totalOpenIncidents: number = 0;
  totalClosedIncidents: number = 0;

  ngOnInit(): void {
    this.calculateStats();
    this.filterByStatus('Abierto');
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

  filterByStatus(status: 'Abierto' | 'Cerrado' | 'Todos'): void {
    if (status === 'Todos') {
      this.dataSource.data = MOCK_INCIDENTS;
    } else {
      this.dataSource.data = MOCK_INCIDENTS.filter((incident) => incident.status === status);
    }

    if (this.dataSource.filter){
      this.dataSource.filter = this.dataSource.filter;
    }
  }

  //--- Estadísticas ---
  calculateStats(): void {
    this.totalIncidents = MOCK_INCIDENTS.length;
    this.totalOpenIncidents = MOCK_INCIDENTS.filter((incident) => incident.status === 'Abierto').length;
    this.totalClosedIncidents = MOCK_INCIDENTS.filter((incident) => incident.status === 'Cerrado').length;
  }

}
