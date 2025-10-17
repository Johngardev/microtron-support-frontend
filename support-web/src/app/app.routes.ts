import { Routes } from '@angular/router';
import { LayoutComponent } from './features/layout/layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { IncidentComponent } from './features/dashboard/components/incident/incident.component';
import { IncidentsComponent } from './features/dashboard/components/incidents/incidents.component';
import { SessionsComponent } from './features/dashboard/components/sessions/sessions.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: DashboardComponent
      },
      {
        path: 'incidents',
        component: IncidentsComponent
      },
      {
        path: 'sessions',
        component: SessionsComponent
      },
      {
        path: 'incident/:id',
        component: IncidentComponent
      }

    ]
  }
];
