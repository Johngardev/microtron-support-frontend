import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinner } from "@angular/material/progress-spinner";

interface UserProfile {
  name: string;
  email: string;
  role: string;
  notifications: {
    email: boolean;
    push: boolean;
  };
  theme: 'light' | 'dark' | 'system';
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatProgressSpinner
],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  settingsForm: FormGroup;
  isLoading = false;
  
  // Available themes for the application
  themes = [
    { value: 'light', viewValue: 'Light' },
    { value: 'dark', viewValue: 'Dark' },
    { value: 'system', viewValue: 'System Default' }
  ];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.settingsForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['admin', Validators.required],
      notifications: this.fb.group({
        email: [true],
        push: [true]
      }),
      theme: ['system', Validators.required],
      twoFactorAuth: [false]
    });
  }

  ngOnInit(): void {
    // In a real app, you would load the user's settings here
    this.loadUserSettings();
  }

  private loadUserSettings(): void {
    // Simulate API call to get user settings
    this.isLoading = true;
    
    // Mock data - replace with actual API call
    setTimeout(() => {
      const mockUserSettings: UserProfile = {
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        notifications: {
          email: true,
          push: true
        },
        theme: 'system'
      };
      
      this.settingsForm.patchValue({
        ...mockUserSettings,
        ...mockUserSettings.notifications
      });
      
      this.isLoading = false;
    }, 1000);
  }

  onSubmit(): void {
    if (this.settingsForm.valid) {
      this.isLoading = true;
      
      // In a real app, you would send the form data to your API here
      console.log('Saving settings:', this.settingsForm.value);
      
      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        this.showSuccess('Settings saved successfully!');
      }, 1000);
    }
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  get name() { return this.settingsForm.get('name'); }
  get email() { return this.settingsForm.get('email'); }
  get role() { return this.settingsForm.get('role'); }
  get theme() { return this.settingsForm.get('theme'); }
  get twoFactorAuth() { return this.settingsForm.get('twoFactorAuth'); }
}
