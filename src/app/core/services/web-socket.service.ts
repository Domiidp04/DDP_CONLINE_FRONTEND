import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Message } from '../models/Message.model';
import { MessageInput } from '../models/MessageInput.model';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService implements OnInit{

  private stompClient: any;
  private messageStream = new BehaviorSubject<Message>(null);

  constructor() {
    this.initConnectionSocket();
   }

  ngOnInit(): void {
    this.initConnectionSocket();
  }

  private initConnectionSocket(): void {
    this.stompClient = Stomp.over(new SockJS('http://localhost:8081/chat-websocket'));

    this.stompClient.connect({ }, () => {
      this.stompClient.subscribe('/topic/public', (message: Message) => {
        const parsedMessage: Message = JSON.parse(message.content);
        this.messageStream.next(parsedMessage);
      });
    });
  }

  public sendMessage(senderId: number, content: string): void {
    if (this.stompClient && this.stompClient.connected) {
      const messageInput: MessageInput = {
        senderId: senderId,
        content: content,
      };

      this.stompClient.send(
        '/app/chat.sendMessage',
        {},
        JSON.stringify(messageInput)
      );
    } else {
      console.error('WebSocket connection is not established.');
    }
  }

  public getMessageStream(): Observable<Message> {
    return this.messageStream.asObservable();
  }
}
