import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { WebSocketService } from '../../../core/services/web-socket.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Message } from '../../../core/models/Message.model';
import { MessageService } from '../../../core/services/message.service';

@Component({
  selector: 'app-chat-details',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat-details.component.html',
  styleUrl: './chat-details.component.css'
})
export class ChatDetailsComponent implements OnInit, AfterViewChecked{

  @ViewChild('messageList') private messageList: ElementRef;
  public messages: Message[];
  public senderId: number;
  public messageInput: string = '';
  public username: string = 'Desconocido';

  constructor(private chatService: WebSocketService, private userService: UserService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadInitialMessages();
    this.subscribeToMessages();
    this.loadUserInfo();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private async loadInitialMessages() {
    try {
      this.messages = await this.messageService.getMessages();
    } catch (error) {
      console.error('Error cargando mensajes iniciales:', error);
    }
  }

  private subscribeToMessages(): void {
    this.chatService.getMessageStream().subscribe({
      next: (message: Message) => {
        if (message) {
          this.messages.push(message);
          console.log(this.messages);
        }
      },
      error: (error) => console.error('Error en el stream de mensajes:', error),
    });
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

  public sendMessage(): void {
    if (this.messageInput.trim()) {
      this.chatService.sendMessage(this.senderId, this.messageInput);
      this.messageInput = '';
    }
  }

  private scrollToBottom(): void {
    try {
      this.messageList.nativeElement.scrollTop = this.messageList.nativeElement.scrollHeight;
  } catch(err) { }
  }

}
