import { Component, ViewChild } from '@angular/core';
import { Session } from '../../../../core/models/session.model';
import { Manufacturer } from '../../../../core/models/manufacturer.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DatePipe } from '@angular/common';
import { MatSort } from '@angular/material/sort';
import { SessionService } from '../../../../core/services/session.service';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateSessionComponent } from '../../../../shared/create-session/create-session.component';
import { RouterLink } from "@angular/router";

export enum SessionStatus {
    Abierto = 'Abierto',
    Cerrado = 'Cerrado',
    Todos = 'Todos'
}

@Component({
  selector: 'app-sessions',
  standalone: true,
  imports: [MatTableModule, MatTabsModule, MatFormFieldModule, MatInputModule, DatePipe, CreateSessionComponent, RouterLink],
  templateUrl: './sessions.component.html',
  styleUrl: './sessions.component.css'
})
export class SessionsComponent {
  private _sessionService = inject(SessionService);
  private readonly createSession = inject(MatDialog);

  displayedColumns: string[] = ['id', 'manufacturer', 'title', 'description', 'admin', 'requestDate', 'scheduledDate', 'status'];

  dataSource = new MatTableDataSource<Session>();

  @ViewChild(MatSort) sort!: MatSort;

  totalSessions: number = 0;
  totalOpenSessions: number = 0;
  totalClosedSessions: number = 0;

  ngOnInit(): void {
    this.calculateStats();
    this.filterByStatus(SessionStatus.Abierto);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  filterByStatus(status: SessionStatus): void {
    this._sessionService.getSessions(status).subscribe(data => {
      this.dataSource.data = data;
      if (this.dataSource.filter) {
        this.dataSource.filter = this.dataSource.filter;
      }
    })
  }

  calculateStats(): void {
    this._sessionService.getSessionStats().subscribe(stats => {
      this.totalSessions = stats.total;
      this.totalOpenSessions = stats.open;
      this.totalClosedSessions = stats.closed;
    })
  }

  opendialogSession() {
    const dialogRef = this.createSession.open(CreateSessionComponent);
  }
}
