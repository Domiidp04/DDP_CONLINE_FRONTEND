import { HttpClient } from '@angular/common/http';
import { Component, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { OAuthModule, OAuthService } from 'angular-oauth2-oidc';  // Importar OAuthModule
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../../model/User.model';
import { UserService } from '../../services/user.service';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SafeUrlPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  public user = signal<User>(null);

  constructor(private authService: AuthService, private userService: UserService, private router: Router) {}


  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.userService.getData().subscribe({
      next: (data: User) => {
        this.user.set(data);
        console.log('Datos del usuario:', data);
        console.log(this.user().profilePictureUrl);

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
        // Si el logout es exitoso, eliminamos el token de localStorage
        localStorage.removeItem('token');
        // Redirigir al usuario al login
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error al cerrar sesión', err);
      }
    });
  }


}
