import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { sessionRestoreGuard } from './session-restore.guard';

describe('sessionRestoreGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => sessionRestoreGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
