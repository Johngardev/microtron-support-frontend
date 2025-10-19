import { Component, inject } from '@angular/core';
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

  sessionForm = this._formBuilder.group({
    manufacturer: ['', Validators.required],
    product: ['', Validators.required],
    description: ['', Validators.required],
    scheduledTime1: ['', Validators.required],
    scheduledTime2: ['', Validators.required],
    scheduledTime3: ['', Validators.required],
    phone: ['', Validators.required],
  });
}
