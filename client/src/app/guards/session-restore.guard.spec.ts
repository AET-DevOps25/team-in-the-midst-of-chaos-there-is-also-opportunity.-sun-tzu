import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { sessionRestoreGuard } from './session-restore.guard';

describe('sessionRestoreGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => sessionRestoreGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
