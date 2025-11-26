import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Session } from '../models/session.model';
import { Observable, map } from 'rxjs';
import { SessionStatus } from '../../features/dashboard/components/sessions/sessions.component';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private apiUrl = `${environment.apiUrl}/sessions`;

  constructor(private httpClient: HttpClient) { }

  getAllSessions(): Observable<Session[]> {
    return this.httpClient.get<Session[]>(this.apiUrl).pipe(
      map(sessions => sessions.map(s => this.normalizeSession(s)))
    );
  }

  getSessionById(id: string): Observable<Session> {
    return this.httpClient.get<Session>(`${this.apiUrl}/${id}`).pipe(
      map(s => this.normalizeSession(s))
    );
  }

  getSessions(status: SessionStatus): Observable<Session[]> {
    if (status === SessionStatus.Todos) {
      return this.getAllSessions();
    }
    return this.httpClient.get<Session[]>(`${this.apiUrl}?status=${status}`).pipe(
      map(sessions => sessions.map(s => this.normalizeSession(s)))
    );
  }

  private normalizeSession(s: Session): Session {
    // Asegurar que las fechas son objetos Date
    const req = s.requestDate ? new Date(s.requestDate as any) : null;
    const sch = s.scheduledDate ? new Date(s.scheduledDate as any) : null;

    // Asegurar manufacturerName disponible
    const manufacturerName = s.manufacturerName || (s.manufacturer as any)?.name || s.manufacturerKey || '';

    return {
      ...s,
      requestDate: req as any,
      scheduledDate: sch as any,
      manufacturerName,
    } as Session;
  }

  getSessionStats(): Observable<{total: number; open: number; closed: number}> {
    return this.httpClient.get<{total: number; open: number; closed: number}>(`${this.apiUrl}/stats`);
  }

  createSession(session: Omit<Session, 'id'>): Observable<Session> {
    return this.httpClient.post<Session>(this.apiUrl, {
      manufacturerKey: (session as any).manufacturerKey || session.manufacturer?.key,
      manufacturerName: (session as any).manufacturerName || session.manufacturer?.name,
      title: session.title,
      description: session.description,
      admin: session.admin,
      emails: session.emails,
      requestDate: session.requestDate,
      scheduledDate: session.scheduledDate,
    });
  }

  updateSession(id: string, updates: Partial<Session>): Observable<Session> {
    return this.httpClient.patch<Session>(`${this.apiUrl}/${id}`, updates);
  }

  deleteSession(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }

  createCalendlyEvent(
    sessionId: string,
    eventTypeUri: string,
    inviteeEmail: string,
    inviteeName: string,
  ): Observable<{ eventUri: string; inviteeUri: string }> {
    return this.httpClient.post<{ eventUri: string; inviteeUri: string }>(
      `${this.apiUrl}/${sessionId}/calendly-event`,
      {
        eventTypeUri,
        inviteeEmail,
        inviteeName,
      },
    );
  }

  cancelCalendlyEvent(sessionId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${sessionId}/calendly-event`);
  }

  getCalendlyEventDetails(sessionId: string, eventUri: string): Observable<any> {
    return this.httpClient.get<any>(
      `${this.apiUrl}/${sessionId}/calendly-event/details?eventUri=${eventUri}`,
    );
  }

}
