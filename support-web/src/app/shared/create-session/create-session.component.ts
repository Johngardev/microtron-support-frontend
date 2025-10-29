import { Component, HostListener, inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDivider } from "@angular/material/divider";
import { MatDialogContent, MatDialogActions } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from '@angular/common';
import { MatIcon } from "@angular/material/icon";

declare var Calendly: any;

@Component({
  selector: 'app-create-session',
  standalone: true,
  imports: [MatDialogModule, 
    ReactiveFormsModule, 
    MatStepperModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatDivider, 
    MatDialogContent, 
    MatDialogActions, 
    MatButtonModule, 
    CommonModule, 
    MatIcon],
  templateUrl: './create-session.component.html',
  styleUrl: './create-session.component.css'
})
export class CreateSessionComponent {
  private _formBuilder = inject(FormBuilder);

  currentUser = 'johndoe@microtron.com';

  sessionForm = this._formBuilder.group({
    manufacturer: ['', Validators.required],
    product: ['', Validators.required],
    description: ['', Validators.required],
    phone: ['', Validators.required],
    calendlyEventUri: ['', Validators.required],
    scheduledTime: ['']
  });

  get isFormPrefilled() {
    //Validate that all required fields are filled
    const { manufacturer, product, description, phone } = this.sessionForm.controls;
    return manufacturer.valid && product.valid && description.valid && phone.valid;
  }

  //Este HostListener es la clave para recibir datos *desde* Calendly
  @HostListener('window:message', ['$event'])
  onCalendlyEvent(event: MessageEvent) {
    // Verificamos que el mensaje venga de Calendly
    if (event.origin !== 'https://calendly.com') {
      return;
    }

    // Verificamos que sea el evento que nos interesa: "evento programado"
    if (event.data.event === 'calendly.event_scheduled') {
      console.log('Evento de Calendly recibido:', event.data.payload);

      // 4. ¡Éxito! Guardamos los datos en nuestro formulario
      this.sessionForm.patchValue({
        calendlyEventUri: event.data.payload.event.uri,
        scheduledTime: event.data.payload.event.start_time, // Formato ISO
      });
      
      // Cerramos el popup de Calendly (si sigue abierto)
      Calendly.closePopupWidget();
    }
  }

  ngOnInit() {
    // Opcional: Escuchar cambios en el teléfono para pasarlo a Calendly
    // (Calendly no tiene un campo 'phone' estándar en prefill, 
    // pero puedes añadirlo como otra pregunta personalizada 'a4' si quieres)
  }

  // 5. Función para abrir el Popup de Calendly
  scheduleSession() {
    if (!this.isFormPrefilled) {
      return; // No debería pasar si el botón está deshabilitado
    }

    const formValue = this.sessionForm.value;

    Calendly.initPopupWidget({
      url: 'https://calendly.com/soporte-microtron/soporte-microtron-sas',
      text: 'Programa la sesión',
      color: '#dd0b26',
      textColor: '#ffffff',
      branding: true,
      // 6. Aquí pasamos los datos del formulario a Calendly
      prefill: {
        // Campos estándar
        email: this.currentUser,
        // (No hay un campo 'name' en tu formulario, si lo tuvieras, iría aquí)
        // name: 'Nombre Apellido', 
        
        // Campos personalizados (mapeados a las preguntas que creaste)
        custom_answers: {
          a1: formValue.description,  // Pregunta 1: Descripción
          a2: formValue.manufacturer, // Pregunta 2: Fabricante
          a3: formValue.product,      // Pregunta 3: Producto
          // Si añades pregunta para teléfono:
          // a4: formValue.phone 
        }
      }
    });
  }

}
