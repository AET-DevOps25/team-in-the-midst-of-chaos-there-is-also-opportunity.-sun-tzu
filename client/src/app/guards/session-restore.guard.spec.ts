import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { sessionRestoreGuard } from './session-restore.guard';
import { SessionService } from '@app/services/session.service';
import { of } from 'rxjs';

describe('sessionRestoreGuard', () => {
  let sessionService: SessionService;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => sessionRestoreGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SessionService]
    });
    sessionService = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return true if session is initialized', (done) => {
    spyOn(sessionService, 'isInitialized').and.returnValue(true);
    (executeGuard({} as any, {} as any) as any).subscribe((result: boolean) => {
      expect(result).toBe(true);
      done();
    });
  });

  it('should restore session and return true if not initialized', (done) => {
    spyOn(sessionService, 'isInitialized').and.returnValue(false);
    spyOn(sessionService, 'restoreSession').and.returnValue(of(undefined));
    (executeGuard({} as any, {} as any) as any).subscribe((result: boolean) => {
      expect(result).toBe(true);
      expect(sessionService.restoreSession).toHaveBeenCalled();
      done();
    });
  });
});
