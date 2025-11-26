import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Session } from '../../../../core/models/session.model';
import { Manufacturer } from '../../../../core/models/manufacturer.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { MatSort } from '@angular/material/sort';
import { SessionService } from '../../../../core/services/session.service';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateSessionComponent } from '../../../../shared/create-session/create-session.component';
import { RouterLink } from "@angular/router";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export enum SessionStatus {
    Abierto = 'Abierto',
    Cerrado = 'Cerrado',
    Todos = 'Todos'
}

@Component({
  selector: 'app-sessions',
  standalone: true,
  imports: [MatTableModule, MatTabsModule, MatFormFieldModule, MatInputModule, MatIconModule, DatePipe, RouterLink],
  templateUrl: './sessions.component.html',
  styleUrl: './sessions.component.css'
})
export class SessionsComponent implements OnInit, OnDestroy {
  private _sessionService = inject(SessionService);
  private readonly createSession = inject(MatDialog);
  private destroy$ = new Subject<void>();

  displayedColumns: string[] = ['id', 'manufacturer', 'title', 'description', 'admin', 'requestDate', 'scheduledDate', 'status'];

  dataSource = new MatTableDataSource<Session>();

  @ViewChild(MatSort) sort!: MatSort;

  totalSessions: number = 0;
  totalOpenSessions: number = 0;
  totalClosedSessions: number = 0;
  isLoading: boolean = false;

  ngOnInit(): void {
    this.calculateStats();
    this.filterByStatus(SessionStatus.Abierto);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  filterByStatus(status: SessionStatus): void {
    this.isLoading = true;
    this._sessionService.getSessions(status)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.dataSource.data = data;
          if (this.dataSource.filter) {
            this.dataSource.filter = this.dataSource.filter;
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al obtener sesiones:', error);
          this.isLoading = false;
        }
      });
  }

  calculateStats(): void {
    this._sessionService.getSessionStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats) => {
          this.totalSessions = stats.total;
          this.totalOpenSessions = stats.open;
          this.totalClosedSessions = stats.closed;
        },
        error: (error) => {
          console.error('Error al obtener estadísticas:', error);
        }
      });
  }

  opendialogSession() {
    const dialogRef = this.createSession.open(CreateSessionComponent);
    
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result) {
          // Recargar datos después de crear una sesión
          this.calculateStats();
          this.filterByStatus(SessionStatus.Abierto);
        }
      });
  }
}
