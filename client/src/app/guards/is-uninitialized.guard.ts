import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { InitializationService } from '@app/services';

export const isUninitializedGuard: CanMatchFn = (route, segments) => {
  const initService = inject(InitializationService)
  return !initService.isInitialized()
};
