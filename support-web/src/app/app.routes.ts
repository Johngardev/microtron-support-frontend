import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'incidents',
        loadComponent: () => import('./features/dashboard/components/incidents/incidents.component').then(m => m.IncidentsComponent)
      },
      {
        path: 'sessions',
        loadComponent: () => import('./features/dashboard/components/sessions/sessions.component').then(m => m.SessionsComponent)
      },
      {
        path: 'incident/:id',
        loadComponent: () => import('./features/dashboard/components/incident/incident.component').then(m => m.IncidentComponent)
      },
      {
        path: 'summary',
        loadComponent: () => import('./features/dashboard/components/summary/summary.component').then(m => m.SummaryComponent)
      }
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login/login.component').then(m => m.LoginComponent),
    title: 'Iniciar sesión - Microtrón Support',
    data: { animation: 'login' }
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./auth/login/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
    title: 'Recuperar contraseña - Microtrón Support',
    data: { animation: 'forgot-password' }
  }
];
