import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '@app/services/session.service';
import { map, of, tap } from 'rxjs';


export const playerAccessGuard: CanActivateFn = (route, state) => {
  const sessionService = inject(SessionService);

  return sessionService.hasSession()
    ? of(true)
    : sessionService.createSession().pipe(map(() => true))
};
