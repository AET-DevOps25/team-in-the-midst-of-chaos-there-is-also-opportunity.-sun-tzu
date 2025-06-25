import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '@app/services/session.service';
import { from, map, of } from 'rxjs';


export const welcomeRedirectGuard: CanActivateFn = (route, state) => {
  const sessionService = inject(SessionService);
  const router = inject(Router);

  return sessionService.hasSession()
    ? from(router.navigate(['/player'])).pipe(map(() => false))
    : of(true);
};
