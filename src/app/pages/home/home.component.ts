import { Component, HostListener, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../../core/models/User.model';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { ContactsComponent } from '../../shared/components/contacts/contacts.component';
import { MainContentComponent } from '../../shared/components/main-content/main-content.component';
import { ChatDetailsComponent } from '../../shared/components/chat-details/chat-details.component';
import { Message } from '../../core/models/Message.model';
import { MessageService } from '../../core/services/message.service';
import { WebSocketService } from '../../core/services/web-socket.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ContactsComponent, MainContentComponent, ChatDetailsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  public user = signal<User>(null);
  public fullName = signal<string>('');
  public image = signal<string>('');
  public onSelectedChat: boolean = false;
  public lastMessage: Message;
  public messages: Message[] = [];

  constructor(private authService: AuthService, private userService: UserService, private router: Router, private messageService: MessageService, private webSocketService: WebSocketService) { }


  ngOnInit(): void {
    this.loadData();
    this.getLastMessage();
    this.subscribeToNewMessages();
  }

  private loadData(): void {
    this.userService.getData().subscribe({
      next: (data: User) => {
        this.user.set(data);
        this.image.set(data.profilePictureUrl);
        this.fullName.set(data.firstName + ' ' + data.lastName);
      },
      error: (error: any) => {
        if (error.message === 'Unauthorized') {
          console.error('Token inválido o expirado');
          localStorage.removeItem('token');
          this.router.navigate(['/login']); // Redirigir al login
        } else {
          console.error('Error al obtener los datos:', error);
        }
      },
    });
  }

  public onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error al cerrar sesión', err);
      }
    });
  }

  private async getLastMessage(): Promise<void> {
    try {
      this.lastMessage = await this.messageService.getLastMessage();
      if (this.lastMessage) {
        this.messages.push(this.lastMessage);
      }
    } catch (error) {
      console.error('Error al cargar el último mensaje:', error);
    }
  }

  private subscribeToNewMessages(): void {
    this.webSocketService.getMessageStream().subscribe({
      next: (message: Message | null) => {
        if (message) {
          this.messages.push(message);
          this.lastMessage = message;
        }
      },
      error: (error) => console.error('Error en el stream de mensajes:', error),
    });
  }

  @HostListener('document:keydown.escape', ['$event'])
  public onEscape(event: KeyboardEvent) {
    this.onSelectedChat = false;
  }


}
