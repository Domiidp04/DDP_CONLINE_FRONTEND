import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../../services/web-socket.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChatMessage } from '../../model/ChatMessage.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  messageInput: string = '';
  messageList: ChatMessage[] = [];
  username: string = 'Desconocido'; // Inicializa con un valor predeterminado

  constructor(private chatService: WebSocketService, private userService: UserService) {}

  ngOnInit(): void {
    // Carga mensajes desde el servicio WebSocket
    this.chatService.getMessages().subscribe((messages) => {
      this.messageList = messages;
    });

    this.loadUserInfo();
  }

  private loadUserInfo(): void {
    const accessToken = localStorage.getItem('token'); // Token almacenado en el localStorage
    if (accessToken) {
      this.userService.getData().subscribe({
        next: (userInfo) => {
          this.username = userInfo.email || 'Usuario';
        },
        error: (error) => {
          console.error('Error obteniendo información del usuario:', error);
        },
      });
    }
  }

  sendMessage(): void {
    if (this.messageInput.trim()) {
      this.chatService.sendMessage(this.messageInput, this.username);
      this.messageInput = '';
    }
  }


}
