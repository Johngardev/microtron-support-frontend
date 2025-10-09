import { Component } from '@angular/core';
import { Session } from '../../../../core/models/session.model';
import { Manufacturer } from '../../../../core/models/manufacturer.model';

const MOCK_SESSIONS: Session[] = [
    { id: 'S-1024', manufacturer: { key: 'Adobe', name: 'Adobe', topics: [] }, title: 'Adobe Photoshop', description: 'Adobe Photoshop', host: 'John Doe', emails: ['john.doe@example.com'], scheduledDate: new Date('2025-09-15'), status: 'Abierta' },
    { id: 'S-1025', manufacturer: { key: 'Autodesk', name: 'Autodesk', topics: [] }, title: 'Autodesk AutoCAD', description: 'Autodesk AutoCAD', host: 'Jane Smith', emails: ['jane.smith@example.com'], scheduledDate: new Date('2025-09-20'), status: 'Cerrada' },
    { id: 'S-1026', manufacturer: { key: 'Microsoft', name: 'Microsoft', topics: [] }, title: 'Microsoft 365', description: 'Microsoft 365', host: 'John Doe', emails: ['john.doe@example.com'], scheduledDate: new Date('2025-09-22'), status: 'Abierta' },
    { id: 'S-1027', manufacturer: { key: 'Anydesk', name: 'Anydesk', topics: [] }, title: 'Anydesk', description: 'Anydesk', host: 'Peter Jones', emails: ['peter.jones@example.com'], scheduledDate: new Date('2025-10-01'), status: 'Cerrada' },
];

export enum SessionStatus {
    Abierta = 'Abierta',
    Cerrada = 'Cerrada',
    Todos = 'Todos'
}

@Component({
  selector: 'app-sessions',
  standalone: true,
  imports: [],
  templateUrl: './sessions.component.html',
  styleUrl: './sessions.component.css'
})
export class SessionsComponent {

}
