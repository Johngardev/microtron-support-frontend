import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { User } from '../../../../../core/models/user.model';
import { UsersService } from '../../../../../core/services/users.service';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'email',
    'phone',
    'role',
    'status',
    'lastLogin',
    'actions'
  ];
  dataSource: User[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private usersService: UsersService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.error = null;
    
    this.usersService.getUsers().subscribe({
      next: (users) => {
        this.dataSource = users;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los usuarios. Por favor, intente de nuevo.';
        this.loading = false;
        console.error('Error loading users:', err);
      }
    });
  }

  openAddUserDialog() {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '600px',
      data: { user: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  editUser(user: User) {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '600px',
      data: { user: { ...user } }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  deleteUser(user: User) {
    if (confirm(`¿Está seguro de eliminar al usuario ${user.name}?`)) {
      this.usersService.deleteUser(user._id).subscribe({
        next: () => {
          this.snackBar.open('Usuario eliminado correctamente', 'Cerrar', {
            duration: 3000
          });
          this.loadUsers();
        },
        error: (err) => {
          this.snackBar.open('Error al eliminar el usuario', 'Cerrar', {
            duration: 3000
          });
          console.error('Error deleting user:', err);
        }
      });
    }
  }

}
