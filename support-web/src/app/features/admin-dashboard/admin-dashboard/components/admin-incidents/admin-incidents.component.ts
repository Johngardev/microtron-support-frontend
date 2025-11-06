import { Component, inject } from '@angular/core';
import { IncidentService } from '../../core/services/incident.service';
import { Incident } from '../../core/models/incident.model';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-admin-incidents',
  standalone: true,
  imports: [],
  templateUrl: './admin-incidents.component.html',
  styleUrl: './admin-incidents.component.css'
})
export class AdminIncidentsComponent {
  private _incidentService = inject(IncidentService);

  
}
