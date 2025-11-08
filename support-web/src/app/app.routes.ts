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
        path: 'session/:id',
        loadComponent: () => import('./features/dashboard/components/session/session.component').then(m => m.SessionComponent)
      },
      {
        path: 'summary',
        loadComponent: () => import('./features/dashboard/components/summary/summary.component').then(m => m.SummaryComponent)
      },
      {
        path: 'admin-dashboard',
        loadComponent: () => import('./features/admin-dashboard/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
        title: 'Admin Dashboard - Microtrón Support',
        data: { animation: 'admin-dashboard' }
      },
      {
        path: 'admin-incidents',
        loadComponent: () => import('./features/admin-dashboard/admin-dashboard/components/admin-incidents/admin-incidents.component').then(m => m.AdminIncidentsComponent),
        title: 'Admin Incidents - Microtrón Support',
        data: { animation: 'admin-incidents' }
      },
      {
        path: 'admin-sessions',
        loadComponent: () => import('./features/admin-dashboard/admin-dashboard/components/admin-sessions/admin-sessions.component').then(m => m.AdminSessionsComponent),
        title: 'Admin Sessions - Microtrón Support',
        data: { animation: 'admin-sessions' }
      },
      {
        path: 'admin-session/:id',
        loadComponent: () => import('./features/admin-dashboard/admin-dashboard/components/admin-session/admin-session.component').then(m => m.AdminSessionComponent),
        title: 'Admin Session - Microtrón Support',
        data: { animation: 'admin-session' }
      },
      {
        path: 'admin-incident/:id',
        loadComponent: () => import('./features/admin-dashboard/admin-dashboard/components/admin-incident/admin-incident.component').then(m => m.AdminIncidentComponent),
        title: 'Admin Incident - Microtrón Support',
        data: { animation: 'admin-incident' }
      },
    ],
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
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register/register.component').then(m => m.RegisterComponent),
    title: 'Registrarse - Microtrón Support',
    data: { animation: 'register' }
  }
];
