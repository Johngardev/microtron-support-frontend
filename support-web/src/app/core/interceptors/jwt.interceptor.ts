import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Skip adding token for auth requests
    if (request.url.includes('/auth/')) {
      console.log('JWT Interceptor - Skipping auth request');
      return next.handle(request);
    }

    const token = this.authService.getToken();
    console.log(`JWT Interceptor - Processing request to: ${request.url}`);
    console.log('JWT Interceptor - Token exists:', !!token);
    
    if (token) {
      const authReq = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('JWT Interceptor - Added Authorization header');
      return next.handle(authReq);
    } else {
      console.warn('JWT Interceptor - No token found for protected route', {
        url: request.url,
        method: request.method
      });
      return next.handle(request);
    }
  }
}