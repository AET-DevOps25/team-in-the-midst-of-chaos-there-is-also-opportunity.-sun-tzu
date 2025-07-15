import { Routes } from '@angular/router';
import { welcomeRedirectGuard } from './guards/welcome-redirect.guard';
import { playerAccessGuard } from './guards/player-access.guard';
import { sessionRestoreGuard } from './guards/session-restore.guard';
import { mobileRedirectGuard } from './guards/mobile-redirect.guard';
import { desktopRedirectGuard } from './guards/desktop-redirect.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [sessionRestoreGuard],
    children: [
      {
        path: '',
        canActivate: [welcomeRedirectGuard],
        loadComponent: () => import('@app/components').then(m => m.WelcomePageComponent)
      },
      {
        path: 'player',
        canActivate: [playerAccessGuard, mobileRedirectGuard],
        loadComponent: () => import('@app/components').then(m => m.MainPageComponent)
      },
      {
        path: 'player-mobile',
        canActivate: [playerAccessGuard, desktopRedirectGuard],
        // --- THIS IS THE FIX ---
        // It now correctly loads MainPageMobileComponent
        loadComponent: () => import('@app/components').then(m => m.MainPageMobileComponent)
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('@app/components').then(m => m.PageNotFoundComponent)
  }
];
