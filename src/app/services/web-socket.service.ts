import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ChatMessage } from '../model/ChatMessage.model';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private stompClient: any;
  private messageSubject: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([]);

  constructor() {
    this.initConnectionSocket();
  }

  private initConnectionSocket(): void {
    const url = 'http://localhost:8081/chat-websocket'; // Cambia según tu configuración
    const socket = new SockJS(url);
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, () => {
      console.log('Conexión WebSocket establecida');
      this.stompClient.subscribe('/topic/public', (message: any) => {
        const chatMessage = JSON.parse(message.body);
        const currentMessages = this.messageSubject.getValue();
        currentMessages.push(chatMessage);
        this.messageSubject.next(currentMessages);
      });
    });
  }

  sendMessage(content: string, sender: string): void {
    this.stompClient.send('/app/chat.sendMessage', {}, JSON.stringify({ content, sender }));
  }

  getMessages(): Observable<ChatMessage[]> {
    return this.messageSubject.asObservable();
  }
}
