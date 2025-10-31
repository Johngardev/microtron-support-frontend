import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  isLoading = signal(false);
  isSubmitted = signal(false);
  errorMessage = signal('');
  


  constructor(private fb: FormBuilder
  ) {
    this.forgotPasswordForm = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');
      
      // Simulate API call
      setTimeout(() => {
        console.log('Password reset requested for:', this.forgotPasswordForm.value.email);
        this.isLoading.set(false);
        this.isSubmitted.set(true);
      }, 1500);
    }
  }

  // forgot-password.component.ts


  submitForgotPassword() {
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.forgotPasswordForm.get('email')?.disable(); 
    
   
  }

  get email() { 
    return this.forgotPasswordForm.get('email'); 
  }

}
