import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UserRole } from '../../../../../core/models/user.model';
import { FormBuilder, Validators } from '@angular/forms';
import { UsersService } from '../../../../../core/services/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../../../../../core/models/user.model';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatError, MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatOptionModule } from "@angular/material/core";
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [MatDialogModule, MatFormField, MatLabel, MatError, MatInputModule, MatSelectModule, MatOptionModule, CommonModule, MatCheckboxModule, MatIconModule, MatProgressSpinnerModule, ReactiveFormsModule, MatFormFieldModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent {
  userForm: FormGroup;
  loading = false;
  roles = ['user', 'admin'];

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user?: User }
  ) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern('^[0-9+\\-\\s()]*$')]],
      company: [''],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      role: ['user', Validators.required],
      isActive: [true]
    });

    if (this.data?.user) {
      this.userForm.patchValue(this.data.user);
    }
  }

  onSubmit() {
    if (this.userForm.invalid) {
      return;
    }

    this.loading = true;
    const userData = this.userForm.value;

    const request = this.data?.user
      ? this.usersService.updateUser(this.data.user._id, userData)
      : this.usersService.createUser(userData);

    request.subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error saving user:', error);
        this.loading = false;
      }
    });
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
