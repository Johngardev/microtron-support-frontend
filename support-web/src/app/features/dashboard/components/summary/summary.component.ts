import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from "@angular/material/dialog";
import { CreateIncidentComponent } from './components/create-incident/create-incident.component';
import { HelpTopicComponent } from "../../../../shared/help-topic/help-topic.component";
import { MatTabsModule } from "@angular/material/tabs";

enum CompanyType {
  Adobe = 'adobe',
  Anydesk = 'anydesk',
  Atlasti = 'atlasti',
  Autodesk = 'autodesk',
  Claris = 'claris',
  Corel = 'corel',
  Graphisoft = 'graphisoft',
  Kaspersky = 'kaspersky',
  Microsoft = 'microsoft',
  Panopto = 'panopto',
  Sketchup = 'sketchup',
  Starlab = 'starlab'
}

export interface HelpCard {
  title: string;
  description: string;
  links: { text: string; url: string }[];
}

export interface HelpTopic {
  topicTitle: string;
  popularLinks?: { text: string; url: string }[];
  cards: HelpCard[];
}

export interface Manufacturer {
  key: string;
  name: string;
  topics: HelpTopic[];
}

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule, HelpTopicComponent, MatTabsModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css'
})
export class SummaryComponent {
  companyTypes = CompanyType;
  selectedCompanyType = signal<CompanyType>(CompanyType.Adobe);
  readonly createIncident = inject(MatDialog);

  public setSelectedCompanyType(company: CompanyType) {
    this.selectedCompanyType.set(company);
  }

  public getSelectedCompanyType() {
    return this.selectedCompanyType();
  }

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
