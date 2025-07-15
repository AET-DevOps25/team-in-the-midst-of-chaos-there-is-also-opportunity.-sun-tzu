import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MobileDetectionService } from '@app/services/mobile-detection.service';
import { of, from } from 'rxjs';
import { map } from 'rxjs/operators';

export const desktopRedirectGuard: CanActivateFn = (route, state) => {
  const mobileDetectionService = inject(MobileDetectionService);
  const router = inject(Router);

  if (!mobileDetectionService.isMobile()) {
    // If it's NOT a mobile device, redirect away from the mobile page to the desktop page.
    return from(router.navigate(['/player'])).pipe(map(() => false));
  }

  return of(true);
};
