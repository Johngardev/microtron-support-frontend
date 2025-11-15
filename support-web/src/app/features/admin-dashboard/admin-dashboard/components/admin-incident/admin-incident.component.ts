import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Incident } from '../../../../../core/models/incident.model';
import { IncidentService } from '../../../../../core/services/incident.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AsyncPipe, DatePipe } from '@angular/common';
import { RouterLink } from "@angular/router";
import { NgClass } from '@angular/common';
import { AuthService } from '../../../../../core/services/auth.service';

@Component({
  selector: 'app-admin-incident',
  standalone: true,
  imports: [MatTabsModule, MatFormFieldModule, MatInputModule, DatePipe, RouterLink, NgClass, AsyncPipe],
  templateUrl: './admin-incident.component.html',
  styleUrl: './admin-incident.component.css'
})
export class AdminIncidentComponent {
  incident: Incident | undefined;
  currentUser$ = inject(AuthService).currentUser$;

  constructor(
    private _incidentService: IncidentService,
    private _route: ActivatedRoute,
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
