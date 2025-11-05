import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Stats } from '../models/stats.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  //private apiUrl = `${environment.apiUrl}/stats`; // Asegúrate de tener configurada la URL de tu API

  constructor(private http: HttpClient) { }

  /**
   * Obtiene las estadísticas para el dashboard de administración
   */
  getAdminStats(): Observable<Stats> {
    // En un entorno real, harías una petición HTTP a tu API
    // return this.http.get<Stats>(`${this.apiUrl}/admin`);

    // Datos de ejemplo para desarrollo
    return of({
      totalIncidents: 125,
      openIncidents: 24,
      closedIncidents: 101,
      totalSessions: 45,
      upcomingSessions: 7,
      activeUsers: 32
    });
  }

  /**
   * Obtiene las estadísticas de incidentes
   */
  getIncidentStats(): Observable<{ status: string; count: number }[]> {
    // Datos de ejemplo para el gráfico de incidentes
    return of([
      { status: 'Abiertos', count: 24 },
      { status: 'En Progreso', count: 12 },
      { status: 'Cerrados', count: 101 }
    ]);
  }

  /**
   * Obtiene los incidentes recientes
   */
  getRecentIncidents(limit: number = 5): Observable<any[]> {
    // Datos de ejemplo para la tabla de incidentes recientes
    return of(Array(limit).fill(0).map((_, i) => ({
      id: `INC-${1000 + i}`,
      title: `Incidencia ${i + 1}`,
      status: ['Abierto', 'En Progreso', 'Cerrado'][Math.floor(Math.random() * 3)],
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    })));
  }

  /**
   * Obtiene la actividad reciente
   */
  getRecentActivity(limit: number = 5): Observable<any[]> {
    // Datos de ejemplo para la actividad reciente
    const activities = [
      'Nuevo incidente creado',
      'Incidencia resuelta',
      'Nuevo usuario registrado',
      'Sesión programada',
      'Comentario añadido'
    ];
    
    return of(Array(limit).fill(0).map((_, i) => ({
      id: i + 1,
      activity: activities[Math.floor(Math.random() * activities.length)],
      user: `usuario${i + 1}@ejemplo.com`,
      date: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      icon: this.getActivityIcon(activities[Math.floor(Math.random() * activities.length)])
    })));
  }

  private getActivityIcon(activity: string): string {
    const icons: { [key: string]: string } = {
      'Nuevo incidente creado': 'bug_report',
      'Incidencia resuelta': 'check_circle',
      'Nuevo usuario registrado': 'person_add',
      'Sesión programada': 'event',
      'Comentario añadido': 'comment'
    };
    return icons[activity] || 'notifications';
  }
}
