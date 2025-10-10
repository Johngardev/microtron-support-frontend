import { Component, ViewChild } from '@angular/core';
import { Session } from '../../../../core/models/session.model';
import { Manufacturer } from '../../../../core/models/manufacturer.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DatePipe } from '@angular/common';
import { MatSort } from '@angular/material/sort';

const MOCK_SESSIONS: Session[] = [
    { id: 'S-1024', manufacturer: { key: 'Adobe', name: 'Adobe', topics: [] }, title: 'Adobe Photoshop', description: 'Adobe Photoshop', admin: 'John Doe', emails: ['john.doe@example.com'], requestDate: new Date('2025-09-15'), scheduledDate: new Date('2025-09-15'), status: 'Abierta' },
    { id: 'S-1025', manufacturer: { key: 'Autodesk', name: 'Autodesk', topics: [] }, title: 'Autodesk AutoCAD', description: 'Autodesk AutoCAD', admin: 'Jane Smith', emails: ['jane.smith@example.com'], requestDate: new Date('2025-09-20'), scheduledDate: new Date('2025-09-20'), status: 'Cerrada' },
    { id: 'S-1026', manufacturer: { key: 'Microsoft', name: 'Microsoft', topics: [] }, title: 'Microsoft 365', description: 'Microsoft 365', admin: 'John Doe', emails: ['john.doe@example.com'], requestDate: new Date('2025-09-22'), scheduledDate: new Date('2025-09-22'), status: 'Abierta' },
    { id: 'S-1027', manufacturer: { key: 'Anydesk', name: 'Anydesk', topics: [] }, title: 'Anydesk', description: 'Anydesk', admin: 'Peter Jones', emails: ['peter.jones@example.com'], requestDate: new Date('2025-10-01'), scheduledDate: new Date('2025-10-01'), status: 'Cerrada' },
];

export enum SessionStatus {
    Abierta = 'Abierta',
    Cerrada = 'Cerrada',
    Todos = 'Todos'
}

@Component({
  selector: 'app-sessions',
  standalone: true,
  imports: [MatTableModule, MatTabsModule, MatFormFieldModule, MatInputModule, DatePipe],
  templateUrl: './sessions.component.html',
  styleUrl: './sessions.component.css'
})
export class SessionsComponent {

  displayedColumns: string[] = ['id', 'manufacturer', 'title', 'description', 'admin', 'requestDate', 'scheduledDate', 'status'];

  dataSource = new MatTableDataSource<Session>();

  @ViewChild(MatSort) sort!: MatSort;

  totalSessions: number = 0;
  totalOpenSessions: number = 0;
  totalClosedSessions: number = 0;

  ngOnInit(): void {
    this.calculateStats();
    this.filterByStatus(SessionStatus.Abierta);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  filterByStatus(status: SessionStatus): void {
    if (status === SessionStatus.Todos) {
      this.dataSource.data = MOCK_SESSIONS;
    } else {
      this.dataSource.data = MOCK_SESSIONS.filter((session) => session.status === status);
    }

    if (this.dataSource.filter){
      this.dataSource.filter = this.dataSource.filter;
    }
  }

  calculateStats(): void {
    this.totalSessions = MOCK_SESSIONS.length;
    this.totalOpenSessions = MOCK_SESSIONS.filter((session) => session.status === SessionStatus.Abierta).length;
    this.totalClosedSessions = MOCK_SESSIONS.filter((session) => session.status === SessionStatus.Cerrada).length;
  }
}
