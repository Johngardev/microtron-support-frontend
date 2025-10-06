import { Component } from '@angular/core';
import { FormBuilder,  FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDivider } from "@angular/material/divider";
import { MatIcon } from "@angular/material/icon";
import { MatDialogContent, MatDialogActions, MatDialogRef } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-incident',
  standalone: true,
  imports: [ReactiveFormsModule, MatStepperModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDivider, MatDialogContent, MatDialogActions, MatButtonModule, CommonModule, MatIcon],
  templateUrl: './create-incident.component.html',
  styleUrl: './create-incident.component.css'
})
export class CreateIncidentComponent {
  private _formBuilder = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<CreateIncidentComponent>); // Inyectar MatDialogRef

  selectedFiles: File[] = [];
  isLinear = true; // Para forzar que los pasos se completen en orden

  firstFormGroup = this._formBuilder.group({
    manufacturer: ['', Validators.required],
    priority: ['', Validators.required],
    title: ['', Validators.required],
    description: ['', Validators.required],
    // El control de archivos es opcional, no necesita estar en el form group
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
    if (this.firstFormGroup.valid && this.secondFormGroup.valid) {
      const incidentData = {
        ...this.firstFormGroup.value,
        ...this.secondFormGroup.value,
        attachments: this.selectedFiles // Adjuntar los archivos reales, no solo los nombres
      };
      
      console.log('Enviando incidente:', incidentData);
      
      // Aquí iría tu lógica para enviar los datos a un servicio o API
      
      // Cerrar el diálogo y opcionalmente pasar los datos
      this.dialogRef.close(incidentData); 
    } else {
      console.error('El formulario no es válido');
      // Opcional: Marcar todos los campos como tocados para mostrar errores
      this.firstFormGroup.markAllAsTouched();
      this.secondFormGroup.markAllAsTouched();
    }
  }
}
