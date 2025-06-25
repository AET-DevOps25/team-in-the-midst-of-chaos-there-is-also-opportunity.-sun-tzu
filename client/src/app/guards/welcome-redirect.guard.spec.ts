import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { welcomeRedirectGuard } from './welcome-redirect.guard';

describe('welcomeRedirectGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => welcomeRedirectGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
