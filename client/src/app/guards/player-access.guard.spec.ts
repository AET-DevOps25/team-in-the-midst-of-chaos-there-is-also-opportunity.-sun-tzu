import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { playerAccessGuard } from './player-access.guard';

describe('playerAccessGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => playerAccessGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
