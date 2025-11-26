import { Component, HostListener, inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
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
import { MatChipsModule } from '@angular/material/chips';
import { SessionService } from '../../core/services/session.service';
import { HelpTopicService } from '../../core/services/help-topic.service';
import { LoadingService } from '../../core/services/loading.service';
import { NotificationService } from '../../core/services/notification.service';
import { Manufacturer } from '../../core/models/manufacturer.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

declare var Calendly: any;

/** Tipos para el payload de Calendly (parciales, sólo lo que usamos) */
interface CalendlyEvent {
  uri?: string;
  start_time?: string;
  start?: string;
  startDate?: string;
}

interface CalendlyMessagePayload {
  event?: CalendlyEvent;
}

@Component({
  selector: 'app-create-session',
  standalone: true,
  imports: [
    MatDialogModule, 
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
    MatIcon,
    MatChipsModule
  ],
  templateUrl: './create-session.component.html',
  styleUrl: './create-session.component.css'
})
export class CreateSessionComponent implements OnInit, OnDestroy {
  private _formBuilder = inject(FormBuilder);
  private _sessionService = inject(SessionService);
  private _helpTopicService = inject(HelpTopicService);
  private _loadingService = inject(LoadingService);
  private _notificationService = inject(NotificationService);
  private _dialogRef = inject(MatDialogRef<CreateSessionComponent>);
  private destroy$ = new Subject<void>();

  manufacturers: Manufacturer[] = [];
  selectedEmails: string[] = [];
  calendlyEventData: any = null;
  isSubmitting = false;

  currentUser = sessionStorage.getItem('userEmail') || 'johndoe@microtron.com';

  sessionForm = this._formBuilder.group({
    manufacturer: ['', Validators.required],
    title: ['', Validators.required],
    description: [''],
    email: [this.currentUser, [Validators.required, Validators.email]],
    emails: [[] as string[], Validators.required],
    scheduledDate: ['', Validators.required],
    calendlyEventUri: ['']
  });

  ngOnInit(): void {
    this.loadManufacturers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadManufacturers(): void {
    this._helpTopicService.getManufacturers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (manufacturers) => {
          this.manufacturers = manufacturers;
        },
        error: (error) => {
          console.error('Error al cargar fabricantes:', error);
          this._notificationService.error('Error al cargar fabricantes');
        }
      });
  }

  addEmail(): void {
    const emailControl = this.sessionForm.get('email');
    if (emailControl && emailControl.valid && emailControl.value) {
      const email = emailControl.value;
      if (!this.selectedEmails.includes(email)) {
        this.selectedEmails.push(email);
        this.sessionForm.patchValue({ emails: [...this.selectedEmails] });
        emailControl.reset();
      }
    }
  }

  removeEmail(email: string): void {
    this.selectedEmails = this.selectedEmails.filter(e => e !== email);
    this.sessionForm.patchValue({ emails: [...this.selectedEmails] });
  }

  get isFormPrefilled(): boolean {
    const { manufacturer, title, emails, scheduledDate } = this.sessionForm.controls;
    
    return (
      manufacturer.valid &&
      title.valid &&
      emails.valid &&
      (emails.value as string[])?.length > 0 &&
      scheduledDate.valid
    );
  }

  @HostListener('window:message', ['$event'])
  onCalendlyEvent(event: MessageEvent): void {
    // Aceptar mensajes de Calendly (subdominios incluidos). Esto evita falsos positivos pero
    // es intencionalmente amplio para cubrir distintos orígenes usados por Calendly.
    if (!event.origin || !event.origin.includes('calendly.com')) {
      return;
    }

    // Algunos mensajes de Calendly usan event.type o event (según integración). Normalizamos.
    const eventType = event?.data?.event || event?.data?.type;
    if (eventType !== 'calendly.event_scheduled') {
      return;
    }

    // Guardamos el payload crudo por si se necesita más tarde (se envía al back al crear la sesión)
    this.calendlyEventData = event.data?.payload as CalendlyMessagePayload || event.data?.payload || null;

    const payloadEvent: CalendlyEvent | undefined = this.calendlyEventData?.event;

    // Determinar valor crudo de inicio (Calendly puede nombrarlo distinto según la versión)
    const startRaw = payloadEvent?.start_time || payloadEvent?.start || payloadEvent?.startDate || null;
    const startTime = this.parseCalendlyStart(startRaw);

    // Siempre conservar la URI del evento si está presente
    const uri = payloadEvent?.uri || '';
    this.sessionForm.patchValue({ calendlyEventUri: uri });

    if (!startTime) {
      console.warn('Calendly: fecha de inicio inválida o ausente', { startRaw, payloadEvent, calendlyEventData: this.calendlyEventData });
      this._notificationService.warning('No se pudo obtener la fecha desde Calendly. Por favor selecciona la fecha manualmente.');
      this.safeCloseCalendly();
      return;
    }

    // Formatea para input type=date (YYYY-MM-DD)
    this.sessionForm.patchValue({ scheduledDate: this.formatDateForInput(startTime) });
    this._notificationService.success('Evento programado en Calendly correctamente');
    this.safeCloseCalendly();
  }

  private safeCloseCalendly(): void {
    try {
      if (typeof Calendly !== 'undefined' && Calendly && typeof Calendly.closePopupWidget === 'function') {
        Calendly.closePopupWidget();
      }
    } catch (e) {
      console.warn('safeCloseCalendly: error cerrando popup de Calendly', e);
    }
  }

  /** Intenta convertir distintos formatos de fecha que Calendly podría enviar. */
  private parseCalendlyStart(startRaw: any): Date | null {
    if (!startRaw) return null;

    // Si ya es Date
    if (startRaw instanceof Date) {
      return isNaN(startRaw.getTime()) ? null : startRaw;
    }

    // Algunas veces Calendly puede enviar objetos o strings; intentar string primero
    try {
      const candidate = new Date(startRaw);
      if (!isNaN(candidate.getTime())) return candidate;
    } catch (e) {
      // seguir intentando
    }

    // Intentar parseo manual de formatos comunes (ISO fallback)
    const isoLike = String(startRaw).trim();
    const isoMatch = isoLike.match(/^(\d{4}-\d{2}-\d{2})(?:[T ](.*))?$/);
    if (isoMatch) {
      const d = new Date(isoLike);
      if (!isNaN(d.getTime())) return d;
    }

    return null;
  }

  private formatDateForInput(date: Date): string {
    // toISOString() usa UTC; para un input date preferimos la fecha local. Construimos YYYY-MM-DD local.
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  scheduleSession(): void {
    if (!this.isFormPrefilled) {
      this._notificationService.warning('Por favor completa todos los campos requeridos');
      return;
    }

    const formValue = this.sessionForm.value;

    // URL del evento de Calendly - cambiar según tu URL
    const calendlyUrl = 'https://calendly.com/soporte-microtron/new-meeting';

    Calendly.initPopupWidget({
      url: calendlyUrl,
      text: 'Agendar Sesión',
      color: '#dd0b26',
      textColor: '#ffffff',
      branding: true,
      prefill: {
        email: formValue.email,
        custom_answers: {
          a1: formValue.description || '',
          a2: formValue.manufacturer,
          a3: formValue.title,
        }
      }
    });
  }

  submitSession(): void {
    if (!this.sessionForm.valid) {
      this._notificationService.warning('Por favor completa todos los campos requeridos');
      return;
    }

    if (!this.calendlyEventData) {
      this._notificationService.warning('Por favor agenda una sesión en Calendly primero');
      return;
    }

    this.isSubmitting = true;
    this._loadingService.show();

    const formValue = this.sessionForm.value;
    const selectedManufacturer = this.manufacturers.find(
      m => m.key === formValue.manufacturer
    );

    if (!selectedManufacturer) {
      this._notificationService.error('Fabricante no encontrado');
      this.isSubmitting = false;
      this._loadingService.hide();
      return;
    }

    // Asegurar que las fechas son objetos Date válidos
    const requestDate = new Date();
    const scheduledDate = formValue.scheduledDate 
      ? new Date(formValue.scheduledDate)
      : new Date();

    // Validar que las fechas son válidas
    if (isNaN(requestDate.getTime()) || isNaN(scheduledDate.getTime())) {
      console.error('❌ Fechas inválidas:', { requestDate, scheduledDate });
      this._notificationService.error('Las fechas proporcionadas son inválidas');
      this.isSubmitting = false;
      this._loadingService.hide();
      return;
    }

    const sessionData = {
      manufacturerKey: selectedManufacturer.key,
      manufacturerName: selectedManufacturer.name,
      title: formValue.title || '',
      description: formValue.description || '',
      admin: this.currentUser,
      emails: formValue.emails || [],
      requestDate,
      scheduledDate,
      calendlyEventUri: this.sessionForm.controls.calendlyEventUri.value || undefined,
    };

    console.log('📤 Enviando datos de sesión:', sessionData);

    this._sessionService.createSession(sessionData as any)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (session) => {
          console.log('✅ Sesión creada en backend:', session);
          // Crear evento en Calendly si no existe
          if (!session.calendlyEventUri && this.calendlyEventData) {
            this._sessionService.createCalendlyEvent(
              session.id,
              this.calendlyEventData.event.uri,
              formValue.email || '',
              formValue.email?.split('@')[0] || ''
            ).pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                this._notificationService.success('Sesión creada exitosamente');
                this.isSubmitting = false;
                this._loadingService.hide();
                this._dialogRef.close(session);
              },
              error: (error) => {
                console.error('Error al crear evento Calendly:', error);
                // Continuar aunque falle Calendly
                this._notificationService.success('Sesión creada (error con Calendly)');
                this.isSubmitting = false;
                this._loadingService.hide();
                this._dialogRef.close(session);
              }
            });
          } else {
            this._notificationService.success('Sesión creada exitosamente');
            this.isSubmitting = false;
            this._loadingService.hide();
            this._dialogRef.close(session);
          }
        },
        error: (error) => {
          console.error('Error al crear sesión:', error);
          this._notificationService.error('Error al crear la sesión');
          this.isSubmitting = false;
          this._loadingService.hide();
        }
      });
  }

  closeDialog(): void {
    this._dialogRef.close();
  }

  /** Permite al usuario limpiar la selección hecha en Calendly y editar la fecha manualmente. */
  clearCalendlySelection(): void {
    this.calendlyEventData = null;
    this.sessionForm.patchValue({ calendlyEventUri: '', scheduledDate: '' });
  }
}
