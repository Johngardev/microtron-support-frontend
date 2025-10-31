import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');
  showPassword = signal(false);
  
  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
   //efecto de carga inicial
   setTimeout(() => {
    document.querySelector('.login-container')?.classList.add('loaded');

   }, 100); 
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      
      // Simulación de autenticación
      setTimeout(() => {
        console.log('Login data:', this.loginForm.value);
        this.isLoading.set(false);
      }, 2000);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(value => !value);
  }

  // Getters reactivos con signals
  get email() { 
    return this.loginForm.get('email'); 
  }
  
  get password() { 
    return this.loginForm.get('password'); 
  }
}
