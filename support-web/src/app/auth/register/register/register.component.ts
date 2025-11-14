import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private showPassword$ = new BehaviorSubject<boolean>(false);

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  onSubmit() {
  if (this.registerForm.valid) {
    const { name, email, password } = this.registerForm.value;
    
    if (!name || !email || !password) {
      console.error('Form values are missing');
      return;
    }

    this.authService.register({ 
      name, 
      email, 
      password 
    }).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}

  showPassword() {
    return this.showPassword$?.value;
  }

  togglePasswordVisibility() {
    this.showPassword$?.next(!this.showPassword$?.value);
  }

  
}
