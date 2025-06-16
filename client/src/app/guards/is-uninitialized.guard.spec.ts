import { TestBed } from '@angular/core/testing';
import { CanMatchFn } from '@angular/router';

import { isUninitializedGuard } from './is-uninitialized.guard';

describe('isUninitializedGuard', () => {
  const executeGuard: CanMatchFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => isUninitializedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
