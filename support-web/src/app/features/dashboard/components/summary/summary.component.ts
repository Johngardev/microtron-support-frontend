import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from "@angular/material/dialog";
import { CreateIncidentComponent } from './components/create-incident/create-incident.component';
import { HelpTopicComponent } from "../../../../shared/help-topic/help-topic.component";
import { MatTabsModule } from "@angular/material/tabs";
import { Manufacturer } from "../../../../core/interfaces/manufacturer.interface";

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule, HelpTopicComponent, MatTabsModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css'
})
export class SummaryComponent {
  readonly createIncident = inject(MatDialog);

  opendialog() {
    const dialogRef = this.createIncident.open(CreateIncidentComponent);
  }

  // Aquí centralizamos TODOS los datos de ayuda
  public manufacturers: Manufacturer[] = [
    {
      key: 'adobe',
      name: 'Adobe',
      topics: [
        {
          topicTitle: 'Administración',
          popularLinks: [
            { text: 'Artículos de Asistencia técnica de Adobe', url: '#' },
            { text: 'Foros de la comunidad', url: '#' },
          ],
          cards: [
            { title: 'Introducción', description: 'Aprende a utilizar la Adobe Admin Console...', links: [{text: 'Más información', url: '#'}] },
            { title: 'Configurar la identidad', description: 'Aprende sobre ID y mucho más...', links: [{text: 'Administrar la identidad', url: '#'}, {text: 'Añadir un dominio', url: '#'}] },
            { title: 'Funciones administrativas', description: 'Aprende a definir una jerarquía flexible...', links: [{text: 'Obtener más información', url: '#'}] },
          ]
        },
        {
          topicTitle: 'Creative Cloud',
          cards: [
            { title: 'Instalar Photoshop', description: 'Guía paso a paso para instalar Photoshop...', links: [{text: 'Ver guía', url: '#'}] },
            { title: 'Usar fuentes en la nube', description: 'Sincroniza fuentes en todos tus dispositivos...', links: [{text: 'Aprender ahora', url: '#'}] },
          ]
        }
      ]
    },
    {
      key: 'anydesk',
      name: 'Anydesk',
      topics: [
        {
          topicTitle: 'General',
          cards: [
            { title: 'Cómo conectarse', description: 'Pasos para iniciar tu primera sesión remota.', links: [{text: 'Ver tutorial', url: '#'}] },
          ]
        }
      ]
    },
    // ... Agrega aquí los datos para los demás fabricantes
  ];

  constructor() {}
}
