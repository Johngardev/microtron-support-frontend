import { Injectable } from '@angular/core';
import { Session } from '../models/session.model';
import { IncidentStatus } from '../../features/dashboard/components/incidents/incidents.component';
import { Observable, of } from 'rxjs';
import { SessionStatus } from '../../features/dashboard/components/sessions/sessions.component';

const MOCK_SESSIONS: Session[] = [
    { id: 'S-1024', manufacturer: { key: 'Adobe', name: 'Adobe', topics: [] }, title: 'Adobe Photoshop', description: 'Adobe Photoshop', admin: 'John Doe', emails: ['john.doe@example.com'], requestDate: new Date('2025-09-15'), scheduledDate: new Date('2025-09-15'), status: 'Abierto' },
    { id: 'S-1025', manufacturer: { key: 'Autodesk', name: 'Autodesk', topics: [] }, title: 'Autodesk AutoCAD', description: 'Autodesk AutoCAD', admin: 'Jane Smith', emails: ['jane.smith@example.com'], requestDate: new Date('2025-09-20'), scheduledDate: new Date('2025-09-20'), status: 'Cerrado' },
    { id: 'S-1026', manufacturer: { key: 'Microsoft', name: 'Microsoft', topics: [] }, title: 'Microsoft 365', description: 'Microsoft 365', admin: 'John Doe', emails: ['john.doe@example.com'], requestDate: new Date('2025-09-22'), scheduledDate: new Date('2025-09-22'), status: 'Abierto' },
    { id: 'S-1027', manufacturer: { key: 'Anydesk', name: 'Anydesk', topics: [] }, title: 'Anydesk', description: 'Anydesk', admin: 'Peter Jones', emails: ['peter.jones@example.com'], requestDate: new Date('2025-10-01'), scheduledDate: new Date('2025-10-01'), status: 'Cerrado' },
];

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() { }

  getSessions(status: SessionStatus): Observable<Session[]> {
    if (status === SessionStatus.Todos) {
      return of(MOCK_SESSIONS);
    }
    const filteredSessions = MOCK_SESSIONS.filter(session => session.status === status);
    return of(filteredSessions);
  }

  getSessionStats(): Observable<{total: number; open: number; closed: number}> {
    const total = MOCK_SESSIONS.length;
    const open = MOCK_SESSIONS.filter(session => session.status === IncidentStatus.Abierto).length;
    const closed = MOCK_SESSIONS.filter(session => session.status === IncidentStatus.Cerrado).length;
    return of({total, open, closed});
  }


}
