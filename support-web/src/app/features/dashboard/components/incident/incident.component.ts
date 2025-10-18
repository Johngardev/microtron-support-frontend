import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IncidentService } from '../../../../core/services/incident.service';
import { Incident } from '../../../../core/models/incident.model';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DatePipe } from '@angular/common';
import { RouterLink } from "@angular/router";
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-incident',
  standalone: true,
  imports: [MatTabsModule, MatFormFieldModule, MatInputModule, DatePipe, RouterLink, NgClass],
  templateUrl: './incident.component.html',
  styleUrl: './incident.component.css'
})
export class IncidentComponent {

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
