import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Incident } from '../../../../../core/models/incident.model';
import { IncidentService } from '../../../../../core/services/incident.service';

@Component({
  selector: 'app-admin-incident',
  standalone: true,
  imports: [],
  templateUrl: './admin-incident.component.html',
  styleUrl: './admin-incident.component.css'
})
export class AdminIncidentComponent {
  incident: Incident | undefined;

  constructor(
    private _incidentService: IncidentService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Obtenemos el ID de la URL
    const id = this._route.snapshot.paramMap.get('id');
    if (id) {
      this._incidentService.getIncidentById(id).subscribe(data => {
        this.incident = data;
      });
    }
  }

}
