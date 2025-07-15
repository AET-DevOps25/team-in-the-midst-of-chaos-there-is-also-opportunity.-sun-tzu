import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SessionService } from '@app/services/session.service';
import { of } from 'rxjs';

import { playerAccessGuard } from './player-access.guard';

describe('playerAccessGuard', () => {
  let sessionService: SessionService;
  let router: Router;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => playerAccessGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [SessionService]
    });
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return true if session exists', (done) => {
    spyOn(sessionService, 'hasSession').and.returnValue(true);
    (executeGuard({} as any, {} as any) as any).subscribe((result: any) => {
      expect(result).toBe(true);
      done();
    });
  });

  it('should create session and return true if session does not exist', (done) => {
    spyOn(sessionService, 'hasSession').and.returnValue(false);
    spyOn(sessionService, 'createSession').and.returnValue(of(undefined));
    (executeGuard({} as any, {} as any) as any).subscribe((result: any) => {
      expect(result).toBe(true);
      expect(sessionService.createSession).toHaveBeenCalled();
      done();
    });
  });
});
