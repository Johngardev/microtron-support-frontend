import { Component, inject, ViewChild } from '@angular/core';
import { SessionService } from '../../../../../core/services/session.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Session } from '../../../../../core/models/session.model';
import { SessionStatus } from '../../../../dashboard/components/sessions/sessions.component';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-sessions',
  standalone: true,
  imports: [MatTableModule, MatTabsModule, MatFormFieldModule, MatInputModule, MatIconModule, DatePipe, RouterLink],
  templateUrl: './admin-sessions.component.html',
  styleUrl: './admin-sessions.component.css'
})
export class AdminSessionsComponent {
  private _sessionService = inject(SessionService);

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
}
