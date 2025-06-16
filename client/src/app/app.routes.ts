import { Routes } from '@angular/router';

import { isUninitializedGuard } from '@app/guards';
import { InitialPageComponent } from '@app/components';


/**
 * First, load initial component.
 * This deactivates its route guard, so that upon reload, the actual route is loaded.
 * For root route, the first empty path is taken, i.e. try to load the landing page
 * (its guard might still redirect to the home page).
 * 
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@app/components').then(m => m.WelcomePageComponent)
  },
  {
    path: '**',
    loadComponent: () => import('@app/components').then(m => m.InitialPageComponent),
    canMatch: [isUninitializedGuard]
  },
  {
    path: 'player',
    loadComponent: () => import('@app/components').then(m => m.MainPageComponent)
  },
  {
    path: '**',
    loadComponent: () => import('@app/components').then(m => m.PageNotFoundComponent)
  }
];
