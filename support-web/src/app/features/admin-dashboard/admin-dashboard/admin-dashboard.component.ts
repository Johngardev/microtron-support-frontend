import { Component, inject } from '@angular/core';
import { map, Observable, of, combineLatest } from 'rxjs';
import { catchError, startWith } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../../core/services/users.service';
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
  private sessionService = inject(SessionService);
  private usersService = inject(UsersService);
  // stats$ will emit either Stats or null while loading/error
  stats$: Observable<Stats | null>;
  incidents$: Observable<Incident[]>;
  sessions$: Observable<Session[]>;
  incident: Incident | undefined;

  constructor() {
    // Compose admin stats from incident API + sessions (mock) + users API
    this.stats$ = combineLatest([
      this.incidentService.getIncidentStats(),
      this.sessionService.getAllSessions(),
      this.usersService.getUsers().pipe(catchError(() => of([]))),
      // include all incidents so we can compute assigned/unassigned counts
      this.incidentService.getAllIncidents().pipe(catchError(() => of([])))
    ]).pipe(
      map(([incStats, sessions, users, allIncidents]) => {
        const incidentsArray = Array.isArray(allIncidents) ? allIncidents : [];
        const assigned = incidentsArray.filter(i => i && i.assignedTo).length;
        const unassigned = incidentsArray.length - assigned;
        return ({
          totalIncidents: incStats?.total ?? 0,
          openIncidents: incStats?.open ?? 0,
          closedIncidents: incStats?.closed ?? 0,
          totalSessions: Array.isArray(sessions) ? sessions.length : 0,
          upcomingSessions: Array.isArray(sessions)
            ? sessions.filter(s => s.scheduledDate && new Date(s.scheduledDate) > new Date()).length
            : 0,
          activeUsers: Array.isArray(users) ? users.length : 0,
          assignedIncidents: assigned,
          unassignedIncidents: unassigned
        } as Stats);
      }),
      // show null while loading
      startWith(null),
      catchError(err => {
        console.error('Error composing admin stats', err);
        return of(null);
      })
    );
    this.incidents$ = this.incidentService.getAllIncidents({ status: IncidentStatus.OPEN }).pipe(
  map(incidents => 
    [...incidents]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
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

  // Optional trackBy functions for ngFor performance (if template uses ngFor)
  trackByIncident(index: number, item: Incident) {
    return item?._id || index;
  }

  trackBySession(index: number, item: Session) {
    return item?.id || index;
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'Alta':
        return 'bg-red-200 text-red-800';
      case 'Media':
        return 'bg-yellow-200 text-yellow-800';
      case 'Baja':
        return 'bg-green-200 text-green-800';
      default:
        return 'bg-gray-500 text-white';
    }
  }

}