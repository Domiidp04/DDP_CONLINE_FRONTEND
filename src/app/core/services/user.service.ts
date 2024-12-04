import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { User } from '../models/User.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public baseUrl: string = "http://localhost:8081/users"

  constructor(private http: HttpClient) { }

  public getData(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/profile`, {
      headers: new HttpHeaders({
        Authorization: "Bearer " + localStorage.getItem('token'),
      }),
    }).pipe(
      catchError((error) => {
        if (error.status === 401) {
          return throwError(() => new Error('Unauthorized'));
        }
        return throwError(() => error);
      })
    );
  }
}
