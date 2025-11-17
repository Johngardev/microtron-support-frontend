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
import { Subject, takeUntil } from 'rxjs';

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
  private destroy$ = new Subject<void>();
  
  // Table configuration
  displayedColumns: string[] = ['name', 'email', 'role', 'status', 'actions'];
  dataSource = new MatTableDataSource<User>();
  
  // Pagination
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 100];
  
  // State
  loading = true;
  error: string | null = null;
  
  // View children
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private usersService: UsersService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit(): void {
    this.initializeTable();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeTable(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.sort.sort({ id: 'name', start: 'asc', disableClear: false });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private loadUsers(): void {
    this.setLoadingState(true);
    this.error = null;

    this.usersService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users) => this.handleUsersLoaded(users),
        error: (err) => this.handleLoadError(err)
      });
  }

  private handleUsersLoaded(users: User[]): void {
    this.dataSource.data = users;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.setLoadingState(false);
  }

  private handleLoadError(error: any): void {
    this.error = 'Error al cargar los usuarios. Por favor, intente de nuevo.';
    this.setLoadingState(false);
    console.error('Error loading users:', error);
  }

  private setLoadingState(isLoading: boolean): void {
    this.loading = isLoading;
  }

  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '600px',
      data: { user: null }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.loadUsers();
        }
      });
  }

  editUser(user: User): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '600px',
      data: { user }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.loadUsers();
        }
      });
  }

  deleteUser(user: User): void {
  this.usersService.deleteUser(user._id)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () => {
        this.snackBar.open('Usuario eliminado correctamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.loadUsers();
      },
      error: (err) => {
        this.snackBar.open('Error al eliminar el usuario', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        console.error('Error deleting user:', err);
      }
    });
}

  private confirmDeleteUser(user: User): void {
    this.usersService.deleteUser(user._id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.snackBar.open('Usuario eliminado correctamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.loadUsers();
        },
        error: (err) => {
          this.snackBar.open('Error al eliminar el usuario', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          console.error('Error deleting user:', err);
        }
      });
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
    return role === 'admin' 
      ? 'bg-blue-100 text-blue-800 rounded-full px-2 py-1' 
      : 'bg-green-100 text-green-800 rounded-full px-2 py-1';
  }

  getStatusBadgeClass(status: string): string {
    return status === 'active'
      ? 'bg-green-100 text-green-800 rounded-full px-2 py-1'
      : 'bg-red-100 text-red-800 rounded-full px-2 py-1';
  }
}
