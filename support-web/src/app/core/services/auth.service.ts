import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  // Use a BehaviorSubject to keep track of the login state
  // This allows other components to "subscribe" to the login status
  private _isLoggedIn$ = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this._isLoggedIn$.asObservable();

  constructor(private http: HttpClient) { }

  /**
   * Checks if a token exists in localStorage.
   */
  private hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  /**
   * Logs the user in by sending credentials to the backend.
   */
  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        // Assuming the backend returns a token
        if (response && response.token) {
          localStorage.setItem('authToken', response.token);
          this._isLoggedIn$.next(true); // Notify all subscribers that the user is logged in
        }
      })
    );
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
    localStorage.removeItem('authToken');
    this._isLoggedIn$.next(false); // Notify all subscribers that the user is logged out
    // You might also want to redirect to the login page here
    // this.router.navigate(['/login']);
  }

  /**
   * Gets the authentication token from localStorage.
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }

  register(credentials: { name?: string | null; email?: string | null; password?: string | null }): Observable<any> {
  if (!this.apiUrl) {
    return of({ message: 'registered', token: 'mock-token' }).pipe(delay(1000));
  }
  return this.http.post(`${this.apiUrl}/register`, credentials);
}
}