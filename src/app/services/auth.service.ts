import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, catchError, throwError, Observable } from 'rxjs';
import { User } from '../model/User.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public baseUrl: string = "http://localhost:8081/auth"

  constructor(private http: HttpClient){ }

  public getAuthUrl(): any {
    return this.http.get<{ authURL: string }>(`${this.baseUrl}/url`);
  }

  public getToken(code: string): any{
    return this.http.get<{ token: string }>(`${this.baseUrl}/callback?code=${code}`).pipe(map(
      (response) => {
        localStorage.setItem("token", response.token);
      }
    )
    );
  }

  public logout(): Observable<void> {
    const token = localStorage.getItem('token');  // Obtener el token del localStorage

    if (!token) {
      return new Observable<void>((observer) => {
        observer.error('Token no encontrado');
      });
    }

    // Hacer la solicitud al backend para revocar el token
    return this.http.post<void>(`${this.baseUrl}/logout?token=${token}`, {});
  }



}
