import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatMessage } from '../../core/models/ChatMessage.model';
import { UserService } from '../../core/services/user.service';
import { WebSocketService } from '../../core/services/web-socket.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  public messageInput: string = '';
  public messageList: ChatMessage[] = [];
  public username: string = 'Desconocido';
  public senderId: number;

  constructor(private chatService: WebSocketService, private userService: UserService) { }

  ngOnInit(): void {
    this.loadUserInfo();
  }

  private loadUserInfo(): void {
    const accessToken = localStorage.getItem('token');
    if (accessToken) {
      this.userService.getData().subscribe({
        next: (userInfo) => {
          this.username = userInfo.email || 'Usuario';
          this.senderId = userInfo.id;
        },
        error: (error) => {
          console.error('Error obteniendo información del usuario:', error);
        },
      });
    }
  }

  sendMessage(): void {
    if (this.messageInput.trim()) {
      this.chatService.sendMessage(this.senderId, this.messageInput);
      this.messageInput = '';
    }
  }


}
