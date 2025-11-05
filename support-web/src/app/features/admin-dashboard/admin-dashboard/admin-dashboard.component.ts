import { Component, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { StatsService } from '../../../core/services/stats.service';
import { Stats } from '../../../core/models/stats.model';
import { IncidentService } from '../../../core/services/incident.service';
import { Incident } from '../../../core/models/incident.model';
import { IncidentStatus } from '../../dashboard/components/incidents/incidents.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  private incidentService = inject(IncidentService);
  private statsService = inject(StatsService);
  stats$: Observable<Stats>;
  incidents$: Observable<Incident[]>;

  constructor() {
    this.stats$ = this.statsService.getAdminStats();
    this.incidents$ = this.incidentService.getIncidents(IncidentStatus.Abierto).pipe(
  map(incidents => 
    [...incidents]
      .sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime())
      .slice(0, 3)
  )
);
  }
}