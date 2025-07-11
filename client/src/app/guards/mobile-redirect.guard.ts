import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MobileDetectionService } from '@app/services/mobile-detection.service';
import { of, from } from 'rxjs';
import { map } from 'rxjs/operators';

export const mobileRedirectGuard: CanActivateFn = (route, state) => {
  const mobileDetectionService = inject(MobileDetectionService);
  const router = inject(Router);

  if (mobileDetectionService.isMobile()) {
    // Redirect to the mobile route and prevent activation of the current (desktop) route
    return from(router.navigate(['/player-mobile'])).pipe(map(() => false));
  }

  return of(true);
};
