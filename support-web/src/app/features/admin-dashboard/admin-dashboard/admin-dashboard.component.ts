import { Component, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { StatsService } from '../../../core/services/stats.service';
import { Stats } from '../../../core/models/stats.model';
import { IncidentService } from '../../../core/services/incident.service';
import { Incident } from '../../../core/models/incident.model';
import { IncidentStatus } from '../../dashboard/components/incidents/incidents.component';
import { RouterLink } from '@angular/router';
import { SessionService } from '../../../core/services/session.service';
import { Session } from '../../../core/models/session.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  private incidentService = inject(IncidentService);
  private statsService = inject(StatsService);
  private sessionService = inject(SessionService);
  stats$: Observable<Stats>;
  incidents$: Observable<Incident[]>;
  sessions$: Observable<Session[]>;

  constructor() {
    this.stats$ = this.statsService.getAdminStats();
    this.incidents$ = this.incidentService.getIncidents(IncidentStatus.Abierto).pipe(
  map(incidents => 
    [...incidents]
      .sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime())
      .slice(0, 3)
  )
);
    this.sessions$ = this.sessionService.getAllSessions().pipe(
      map(sessions => 
        [...sessions]
          .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime())
          .slice(0, 3)
      )
    );
  }

}