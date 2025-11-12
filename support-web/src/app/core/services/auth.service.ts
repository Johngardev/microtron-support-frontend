import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, delay, map, tap } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';
import { AuthResponse, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = environment.apiUrl;
  private readonly TOKEN_KEY = 'authToken';
  private readonly USER_KEY = 'currentUser';

  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private notificationService: NotificationService) {
    const user = localStorage.getItem(this.USER_KEY);

    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  /**
   * Checks if a token exists in localStorage.
   */
  private hasToken(): boolean {
    return !!this.getToken();
  }

  /**
   * Logs the user in by sending credentials to the backend.
   */
  login(credentials: { email: string, password: string }): Observable<User> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      map(response => {
        const user = User.fromObject(response.user);
        if (response.access_token) {
          this.setAuthData(response.access_token, user);
          this.notificationService.show({
            id: 'login-success',
            message: 'Login successful',
            type: 'success'
          });
        }
        return user;
      }),
      catchError(error => {
        this.clearAuthData();
        this.notificationService.show({
          id: 'login-error',
          message: 'Login failed',
          type: 'error'
        });
        return throwError(() => error);
      })
    );
  }

  /**
   * Registers a new user by sending credentials to the backend.
   */
  register(userData: { name: string; email: string; password: string }): Observable<User> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, userData).pipe(
      map(response => {
        const user = User.fromObject(response.user);
        this.setAuthData(response.access_token, user);
        this.notificationService.show({
          id: 'register-success',
          message: 'Register successful',
          type: 'success'
        });
        return user;
      }),
      catchError(error => {
        this.clearAuthData();
        this.notificationService.show({
          id: 'register-error',
          message: 'Register failed',
          type: 'error'
        });
        return throwError(() => error);
      })
    );
  }

  /**
   * Handles the "Forgot Password" request.
   */
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email }).pipe(
      tap((response: any) => {
        this.notificationService.show({
          id: 'forgot-password-success',
          message: 'Forgot password successful',
          type: 'success'
        });
      }),
      catchError(error => {
        this.notificationService.show({
          id: 'forgot-password-error',
          message: 'Forgot password failed',
          type: 'error'
        });
        return throwError(() => error);
      })
    );
  }

  /**
   * Requests a password reset by sending the user's email to the backend.
   */
  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/password/request-reset`, { email }).pipe(
      tap((response: any) => {
        this.notificationService.show({
          id: 'request-password-reset-success',
          message: 'Request password reset successful',
          type: 'success'
        });
      }),
      catchError(error => {
        this.notificationService.show({
          id: 'request-password-reset-error',
          message: 'Request password reset failed',
          type: 'error'
        });
        return throwError(() => error);
      })
    );
  }

  /**
   * Resets the user's password using the reset token and new password.
   */
  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/password/reset`, {
      token,
      newPassword
    }).pipe(
      tap((response: any) => {
        this.notificationService.show({
          id: 'reset-password-success',
          message: 'Reset password successful',
          type: 'success'
        });
      }),
      catchError(error => {
        this.notificationService.show({
          id: 'reset-password-error',
          message: 'Reset password failed',
          type: 'error'
        });
        return throwError(() => error);
      })
    );
  }

  private setAuthData(token: string, user: User): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user.toJSON()));
    this.currentUserSubject.next(user);
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }

  get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    this.clearAuthData();
    this.notificationService.show({
      id: 'logout-success',
      message: 'Logout successful',
      type: 'success'
    });
  }

}