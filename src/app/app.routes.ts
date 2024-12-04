import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { notAuthGuard } from './core/guards/not-auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((c) => c.LoginComponent),
    canActivate: [notAuthGuard]
  },

  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then((c) => c.HomeComponent),
    canActivate: [authGuard]
  },

  {
    path: 'chat',
    loadComponent: () => import('./pages/chat/chat.component').then((c) => c.ChatComponent),
    canActivate: [authGuard]
  },

  {
    path: 'contact', loadComponent: () => import('./shared/components/contacts/contacts.component').then((c) => c.ContactsComponent)
  },

  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },

  {
    path: '**',
    redirectTo: '/login'
  }
];
