import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDivider } from "@angular/material/divider";
import { MatIcon } from "@angular/material/icon";
import { MatDialogContent, MatDialogActions, MatDialogRef } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RangeSliderComponent } from "../range-slider/range-slider.component";
import { IncidentService } from '../../core/services/incident.service';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { MatProgressSpinner } from "@angular/material/progress-spinner";

@Component({
  selector: 'app-create-incident',
  standalone: true,
  imports: [ReactiveFormsModule, MatStepperModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDivider, MatDialogContent, MatDialogActions, MatButtonModule, CommonModule, MatIcon, RangeSliderComponent, MatSnackBarModule, MatProgressSpinner],
  templateUrl: './create-incident.component.html',
  styleUrl: './create-incident.component.css'
})
export class CreateIncidentComponent {
  private _formBuilder = inject(FormBuilder);
  private incidentService = inject(IncidentService);
  private snackBar = inject(MatSnackBar);
  public dialogRef = inject(MatDialogRef<CreateIncidentComponent>);

  isLoading = false;

  currentUser = inject(AuthService).currentUser$;

  selectedFiles: File[] = [];
  isLinear = true; // Para forzar que los pasos se completen en orden

  firstFormGroup = this._formBuilder.group({
    manufacturer: ['', Validators.required],
    priority: ['Media' as 'Alta' | 'Media' | 'Baja', Validators.required],
    title: ['', Validators.required],
    description: ['', Validators.required],
  });

  secondFormGroup = this._formBuilder.group({
    notificationEmails: ['', Validators.email] // Se puede añadir validación de email
  });

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const filesArray = Array.from(input.files);
      // Aquí puedes agregar tu lógica de validación de tamaño y tipo
      this.selectedFiles.push(...filesArray);
      input.value = ''; // Limpiar el input para permitir seleccionar el mismo archivo de nuevo
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  onSubmit(): void {
    if (this.firstFormGroup.valid) {
      this.isLoading = true;

      // Mapear los datos del formulario al formato esperado por el servicio
      const incidentData = {
        product: this.firstFormGroup.get('manufacturer')?.value || '',
        title: this.firstFormGroup.get('title')?.value || '',
        description: this.firstFormGroup.get('description')?.value || '',
        priority: this.firstFormGroup.get('priority')?.value || 'Media',
        notificationEmails: this.secondFormGroup.get('notificationEmails')?.value
          ? [this.secondFormGroup.get('notificationEmails')?.value as string]
          : [],
      };
      this.incidentService.createIncident(incidentData)
        .pipe(
          finalize(() => this.isLoading = false)
        )
        .subscribe({
          next: (response) => {
            this.snackBar.open('Incidencia creada exitosamente', 'Cerrar', {
              duration: 5000,
              panelClass: ['success-snackbar']
            });
            this.dialogRef.close({ success: true, data: response });
          },
          error: (error) => {
            console.error('Error al crear la incidencia:', error);
            this.snackBar.open(
              'Error al crear la incidencia. Por favor, inténtalo de nuevo.',
              'Cerrar',
              {
                duration: 5000,
                panelClass: ['error-snackbar']
              }
            );
          }
        });
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      this.firstFormGroup.markAllAsTouched();
      this.secondFormGroup.markAllAsTouched();

      this.snackBar.open(
        'Por favor, completa todos los campos requeridos',
        'Cerrar',
        { duration: 5000 }
      );
    }
  }
}
