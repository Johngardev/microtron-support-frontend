import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { User } from '../../../../../core/models/user.model';
import { UsersService } from '../../../../../core/services/users.service';
import { UserFormComponent } from '../user-form/user-form.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormField, MatLabel } from "@angular/material/form-field";

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
    MatPaginatorModule,
    MatSortModule,
    MatFormField,
    MatLabel
],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'name',
    'email',
    'role',
    'status',
    'actions'
  ];
  dataSource: MatTableDataSource<User>;
  loading = true;
  error: string | null = null;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private usersService: UsersService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<User>();
  }

  ngOnInit() {
    this.loadUsers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  loadUsers() {
    this.loading = true;
    this.error = null;

    this.usersService.getUsers().subscribe({
      next: (users) => {
        this.dataSource.data = users;
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

  getHeaderText(column: string): string {
    const headers: { [key: string]: string } = {
      'name': 'Nombre',
      'email': 'Correo Electrónico',
      'role': 'Rol',
      'status': 'Estado',
      'actions': 'Acciones'
    };
    return headers[column] || column;
  }

  getRoleBadgeClass(role: string): string {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    return role === 'admin'
      ? `${baseClasses} bg-purple-100 text-purple-800`
      : `${baseClasses} bg-green-100 text-green-800`;
  }

  getStatusBadgeClass(status: string): string {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    return status === 'active'
      ? `${baseClasses} bg-green-100 text-green-800`
      : `${baseClasses} bg-yellow-100 text-yellow-800`;
  }

}
