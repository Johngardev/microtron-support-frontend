import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  /**
   * Obtiene todos los usuarios
   * @returns Observable<User[]>
   */
  getUsers() {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.authService.getToken()}`
  });
  return this.http.get<User[]>('http://localhost:3000/users', { headers });
}

  /**
   * Obtiene un usuario por su ID
   * @param id ID del usuario
   * @returns Observable<User>
   */
  getUserById(id: string) {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea un nuevo usuario
   * @param user Datos del usuario a crear
   * @returns Observable<User>
   */
  createUser(user: User) {
    return this.http.post<User>(this.apiUrl, user);
  }

  /**
   * Actualiza un usuario
   * @param id ID del usuario
   * @param user Datos del usuario a actualizar
   * @returns Observable<User>
   */
  updateUser(id: string, user: User) {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  /**
   * Elimina un usuario
   * @param id ID del usuario
   * @returns Observable<void>
   */
  deleteUser(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
