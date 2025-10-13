import { Injectable } from '@angular/core';
import { Incident } from '../models/incident.model';
import { IncidentStatus } from '../../features/dashboard/components/incidents/incidents.component';
import { Observable, of } from 'rxjs';

const MOCK_INCIDENTS: Incident[] = [
  { id: 'C-1024', status: 'Cerrado', product: 'Adobe Photoshop', title: 'Error al exportar a PNG', admin: 'John Doe', priority: 'Media', creationDate: new Date('2025-09-15') },
  { id: 'C-1025', status: 'Cerrado', product: 'Autodesk AutoCAD', title: 'Fallo en la licencia de red', admin: 'Jane Smith', priority: 'Alta', creationDate: new Date('2025-09-20') },
  { id: 'C-1026', status: 'Cerrado', product: 'Microsoft 365', title: 'No se sincroniza OneDrive', admin: 'John Doe', priority: 'Baja', creationDate: new Date('2025-09-22') },
  { id: 'C-1027', status: 'Cerrado', product: 'Anydesk', title: 'Conexión remota inestable', admin: 'Peter Jones', priority: 'Media', creationDate: new Date('2025-10-01') },
  { id: 'C-1028', status: 'Abierto', product: 'Anydesk', title: 'Conexión remota inestable', admin: 'Peter Jones', priority: 'Media', creationDate: new Date('2025-10-01') },
];

@Injectable({
  providedIn: 'root'
})
export class IncidentService {

  constructor() { }

  /**
   * Obtiene los incidentes, opcionalmente filtrados por estado.
   * Devuelve un Observable para simular una llamada a una API asíncrona.
   */
  getIncidents(status: IncidentStatus): Observable<Incident[]> {
    if (status === IncidentStatus.Todos) {
      return of(MOCK_INCIDENTS);
    }
    const filteredIncidents = MOCK_INCIDENTS.filter(incident => incident.status === status);
    return of(filteredIncidents);
  }

  /**
   * Calcula y devuelve las estadísticas de los incidentes.
   */
  getIncidentStats(): Observable<{ total: number; open: number; closed: number }> {
    const total = MOCK_INCIDENTS.length;
    const open = MOCK_INCIDENTS.filter(incident => incident.status === IncidentStatus.Abierto).length;
    const closed = MOCK_INCIDENTS.filter(incident => incident.status === IncidentStatus.Cerrado).length;
    
    return of({ total, open, closed });
  }
}
