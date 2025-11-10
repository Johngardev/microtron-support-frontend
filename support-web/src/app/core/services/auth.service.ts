import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = environment.apiUrl;
  private readonly TOKEN_KEY = 'authToken';
  private readonly USER_KEY = 'currentUser';

  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
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
  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((response: any) => {
        if (response.access_token) {
          this.setAuthData(response);
        }
      }),
      catchError(error => {
        this.clearAuthData();
        return throwError(() => error);
      })
    );
  }

  /**
   * Registers a new user by sending credentials to the backend.
   */
  register(credentials: { name?: string | null; email?: string | null; password?: string | null }): Observable<any> {
    if (!this.apiUrl) {
      return of({ message: 'registered', token: 'mock-token' }).pipe(delay(1000));
    }
    return this.http.post(`${this.apiUrl}/register`, credentials);
  }

  /**
   * Handles the "Forgot Password" request.
   */
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  /**
   * Logs the user out.
   */
  logout(): void {
    this.clearAuthData();
  }

  /**
   * Requests a password reset by sending the user's email to the backend.
   */
  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/password/request-reset`, { email });
  }

  /**
   * Resets the user's password using the reset token and new password.
   */
  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/password/reset`, {
      token,
      newPassword
    });
  }

  private setAuthData(authData: any): void {
    localStorage.setItem(this.TOKEN_KEY, authData.access_token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(authData.user));
    this.currentUserSubject.next(authData.user);
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
    const token = this.getToken();
    if (!token) return false;
    
    // Aquí podrías añadir lógica para verificar si el token está expirado
    // usando librerías como jwt-decode
    
    return true;
  }

}