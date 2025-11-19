import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Incident } from '../models/incident.model';
import { AuthService } from './auth.service';
import { IncidentStatus } from '../../features/dashboard/components/incidents/incidents.component';

export interface CreateIncidentDto {
  product: string;
  title: string;
  description?: string;
  priority: 'Alta' | 'Media' | 'Baja';
  notificationEmails?: string[];
  phoneNumber?: string;
}

export interface UpdateIncidentDto {
  status?: 'Abierto' | 'En Proceso' | 'Resuelto' | 'Cerrado';
  assignedTo?: string;
  description?: string;
  priority?: 'Alta' | 'Media' | 'Baja';
  notificationEmails?: string[];
  phoneNumber?: string;
}

export interface IncidentStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
}

@Injectable({
  providedIn: 'root'
})
export class IncidentService {
  private readonly apiUrl = `${environment.apiUrl}/incidents`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  /**
   * Obtiene todos los incidentes, opcionalmente filtrados por estado
   */
  getAllIncidents(filter?: { status?: string | IncidentStatus }): Observable<Incident[]> {
  const token = this.authService.getToken();
  
  // Create a clean params object with only defined values
  const params: any = {};
  if (filter?.status) {
    params.status = filter.status;
  }

  const options = {
    params: params,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
  
  return this.http.get<Incident[]>(this.apiUrl, options)
}

  /**
   * Obtiene un incidente por su ID
   */
  getIncidentById(id: string): Observable<Incident> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get<Incident>(`${this.apiUrl}/${id}`, { headers });
  }

  /**
   * Crea un nuevo incidente
   */
  createIncident(incidentData: CreateIncidentDto): Observable<Incident> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.post<Incident>(this.apiUrl, incidentData, { headers });
  }

  /**
   * Actualiza un incidente existente
   */
  updateIncident(id: string, updateData: UpdateIncidentDto): Observable<Incident> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.patch<Incident>(`${this.apiUrl}/${id}`, updateData, { headers });
  }

  /**
   * Elimina un incidente
   */
  deleteIncident(id: string): Observable<void> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }

  /**
   * Obtiene estadísticas de incidentes
   */
  getIncidentStats(): Observable<IncidentStats> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get<IncidentStats>(`${this.apiUrl}/stats`, { headers });
  }

}
