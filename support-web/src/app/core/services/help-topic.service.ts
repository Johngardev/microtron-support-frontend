import { Injectable } from '@angular/core';
import { Manufacturer } from '../models/help-topic.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HelpTopicService {

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

  constructor() { }

  getManufacturers(): Observable<Manufacturer[]> {
    return of(this.manufacturers);
  }
}
