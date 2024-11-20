import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { notAuthGuard } from './guards/not-auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((c) => c.LoginComponent),
    canActivate: [notAuthGuard]
  },

  // Ruta para la página principal/home, con protección de ruta
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then((c) => c.HomeComponent),
    canActivate: [authGuard]
  },

  // Ruta para el chat, con protección de ruta
  {
    path: 'chat',
    loadComponent: () => import('./pages/chat/chat.component').then((c) => c.ChatComponent),
    canActivate: [authGuard]
  },

  // Redirección a login si no se especifica ninguna ruta
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },

  // Ruta para manejar cualquier URL que no coincida
  {
    path: '**',
    redirectTo: '/login'
  }
];
