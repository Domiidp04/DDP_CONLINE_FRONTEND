import { HttpClient } from '@angular/common/http';
import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public baseUrl: string = "http://localhost:8081/auth"

  constructor(private http: HttpClient) { }

  public getAuthUrl(): Observable<{ authURL: string }> {
    return this.http.get<{ authURL: string }>(`${this.baseUrl}/url`);
  }

  public getToken(code: string): Observable<void> {
    return this.http.get<{ token: string }>(`${this.baseUrl}/callback?code=${code}`).pipe(map(
      (response) => {
        localStorage.setItem("token", response.token);
      })
    );
  }

  public logout(): Observable<void> {
    const token = localStorage.getItem('token');
    if (!token) {
      return new Observable<void>((observer) => {
        observer.error('Token no encontrado');
      });
    }
    return this.http.post<void>(`${this.baseUrl}/logout?token=${token}`, {});
  }



}
