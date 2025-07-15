import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { welcomeRedirectGuard } from './welcome-redirect.guard';
import { SessionService } from '@app/services/session.service';
import { of } from 'rxjs';

describe('welcomeRedirectGuard', () => {
  let sessionService: SessionService;
  let router: Router;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => welcomeRedirectGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [SessionService]
    });
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return true if no session exists', (done) => {
    spyOn(sessionService, 'hasSession').and.returnValue(false);
    (executeGuard({} as any, {} as any) as any).subscribe((result: boolean) => {
      expect(result).toBe(true);
      done();
    });
  });

  it('should redirect to /player and return false if session exists', (done) => {
    spyOn(sessionService, 'hasSession').and.returnValue(true);
    const navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    (executeGuard({} as any, {} as any) as any).subscribe((result: boolean) => {
      expect(result).toBe(false);
      expect(navigateSpy).toHaveBeenCalledWith(['/player']);
      done();
    });
  });
});
