import { Routes } from '@angular/router';
import { welcomeRedirectGuard } from './guards/welcome-redirect.guard';
import { playerAccessGuard } from './guards/player-access.guard';
import { sessionRestoreGuard } from './guards/session-restore.guard';


/**
 * 
 * GUARD: ensureSessionStateKnown
 *   path "" - guard (redirect to either welcome or player, depending on session state)
 *   path "welcome" - guard (load component if no session, else redirect to player)
 *   path "player" - guard (load component if session, else redirect to welcome)
 * path "**" - 404 page
 */



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
        canActivate: [playerAccessGuard],
        loadComponent: () => import('@app/components').then(m => m.MainPageComponent)
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('@app/components').then(m => m.PageNotFoundComponent)
  }
];