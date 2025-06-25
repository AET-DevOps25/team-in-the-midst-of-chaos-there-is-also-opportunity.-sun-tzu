import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { SessionService } from '@app/services/session.service';
import { map, of } from 'rxjs';

export const sessionRestoreGuard: CanActivateFn = (route, state) => {
  const sessionService = inject(SessionService)
  
  return sessionService.isInitialized()
    ? of(true)
    : sessionService.restoreSession().pipe(map(() => true))
};
