import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  //Rutas publicas
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
  },

  //Rutas protegidas para usuarios autenticados
  {
    path: '',
    loadComponent: () => import('./features/layout/layout.component').then(m => m.LayoutComponent),
    title: 'Microtrón Support',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'Dashboard - Microtrón Support',
        data: { animation: 'dashboard' }
      },
      {
        path: 'incidents',
        loadComponent: () => import('./features/dashboard/components/incidents/incidents.component').then(m => m.IncidentsComponent),
        title: 'Mis Incidencias - Microtrón Support'
      },
      {
        path: 'sessions',
        loadComponent: () => import('./features/dashboard/components/sessions/sessions.component').then(m => m.SessionsComponent),
        title: 'Mis Sesiones - Microtrón Support'
      },
      {
        path: 'incident/:id',
        loadComponent: () => import('./features/dashboard/components/incident/incident.component').then(m => m.IncidentComponent),
        title: 'Detalle de Incidencia - Microtrón Support'
      },
      {
        path: 'session/:id',
        loadComponent: () => import('./features/dashboard/components/session/session.component').then(m => m.SessionComponent),
        title: 'Detalle de Sesión - Microtrón Support'
      },
      {
        path: 'summary',
        loadComponent: () => import('./features/dashboard/components/summary/summary.component').then(m => m.SummaryComponent),
        title: 'Resumen - Microtrón Support'
      },
    ]
  },

  //Rutas protegidas solo para adminitradores
  {
    path: 'admin',
    loadComponent: () => import('./features/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [AuthGuard, AdminGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin-dashboard/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
        title: 'Admin Dashboard - Microtrón Support',
        data: { animation: 'admin-dashboard' }
      },
      {
        path: 'incidents',
        loadComponent: () => import('./features/admin-dashboard/admin-dashboard/components/admin-incidents/admin-incidents.component').then(m => m.AdminIncidentsComponent),
        title: 'Admin Incidencias - Microtrón Support',
        data: { animation: 'admin-incidents' }
      },
      {
        path: 'sessions',
        loadComponent: () => import('./features/admin-dashboard/admin-dashboard/components/admin-sessions/admin-sessions.component').then(m => m.AdminSessionsComponent),
        title: 'Admin Sesiones - Microtrón Support',
        data: { animation: 'admin-sessions' }
      },
      {
        path: 'session/:id',
        loadComponent: () => import('./features/admin-dashboard/admin-dashboard/components/admin-session/admin-session.component').then(m => m.AdminSessionComponent),
        title: 'Admin Sesión - Microtrón Support',
        data: { animation: 'admin-session' }
      },
      {
        path: 'incident/:id',
        loadComponent: () => import('./features/admin-dashboard/admin-dashboard/components/admin-incident/admin-incident.component').then(m => m.AdminIncidentComponent),
        title: 'Admin Incidencia - Microtrón Support',
        data: { animation: 'admin-incident' }
      },
      {
        path: 'users',
        loadComponent: () => import('./features/admin-dashboard/admin-dashboard/components/users/users.component').then(m => m.UsersComponent),
        title: 'Admin Usuarios - Microtrón Support',
        data: { animation: 'admin-users' }
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/admin-dashboard/admin-dashboard/components/settings/settings.component').then(m => m.SettingsComponent),
        title: 'Admin Configuración - Microtrón Support',
        data: { animation: 'admin-settings' }
      }
    ]
  },

];
