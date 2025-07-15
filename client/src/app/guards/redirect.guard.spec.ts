import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { mobileRedirectGuard } from './mobile-redirect.guard';
import { desktopRedirectGuard } from './desktop-redirect.guard';
import { MobileDetectionService } from '@app/services/mobile-detection.service';
import { Observable, of } from 'rxjs';

describe('Redirect Guards', () => {
  let mockRouter: { navigate: jasmine.Spy };
  let mockMobileDetectionService: { isMobile: jasmine.Spy };

  const executeGuard = (guard: CanActivateFn): Observable<boolean> => {
    return TestBed.runInInjectionContext(() => guard({} as any, {} as any)) as Observable<boolean>;
  };

  beforeEach(() => {
    mockRouter = { navigate: jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true)) };
    mockMobileDetectionService = { isMobile: jasmine.createSpy('isMobile') };

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: MobileDetectionService, useValue: mockMobileDetectionService }
      ]
    });
  });

  describe('mobileRedirectGuard', () => {
    it('should redirect to /player-mobile if on mobile', (done) => {
      mockMobileDetectionService.isMobile.and.returnValue(true);
      executeGuard(mobileRedirectGuard).subscribe(result => {
        expect(result).toBe(false);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/player-mobile']);
        done();
      });
    });

    it('should allow access if not on mobile', (done) => {
      mockMobileDetectionService.isMobile.and.returnValue(false);
      executeGuard(mobileRedirectGuard).subscribe(result => {
        expect(result).toBe(true);
        expect(mockRouter.navigate).not.toHaveBeenCalled();
        done();
      });
    });
  });

  describe('desktopRedirectGuard', () => {
    it('should redirect to /player if not on mobile', (done) => {
      mockMobileDetectionService.isMobile.and.returnValue(false);
      executeGuard(desktopRedirectGuard).subscribe(result => {
        expect(result).toBe(false);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/player']);
        done();
      });
    });

    it('should allow access if on mobile', (done) => {
      mockMobileDetectionService.isMobile.and.returnValue(true);
      executeGuard(desktopRedirectGuard).subscribe(result => {
        expect(result).toBe(true);
        expect(mockRouter.navigate).not.toHaveBeenCalled();
        done();
      });
    });
  });
});
