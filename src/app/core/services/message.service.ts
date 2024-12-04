import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Message } from '../models/Message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  public baseUrl: string = 'http://localhost:8081/messages'

  constructor(private http: HttpClient) { }

  public getMessages(): Promise<Message[]> {
    return firstValueFrom(this.http.get<Message[]>(this.baseUrl, {
      headers: new HttpHeaders({
        Authorization: "Bearer " + localStorage.getItem('token'),
      }),
    }));
  }

  public getLastMessage(): Promise<Message> {
    return firstValueFrom(this.http.get<Message>(`${this.baseUrl}/lastMessage`, {
      headers: new HttpHeaders({
        Authorization: "Bearer " + localStorage.getItem('token'),
      }),
    }));
  }
}
