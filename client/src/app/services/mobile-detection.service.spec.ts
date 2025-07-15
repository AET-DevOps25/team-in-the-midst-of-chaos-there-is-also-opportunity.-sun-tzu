import { TestBed } from '@angular/core/testing';
import { MobileDetectionService } from './mobile-detection.service';

describe('MobileDetectionService', () => {
  let service: MobileDetectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MobileDetectionService);
    // Ensure the property is undefined before each test
    delete (window as any).ontouchstart;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should detect mobile via touch events', () => {
    // Manually add the property for this test
    (window as any).ontouchstart = () => {};
    spyOnProperty(navigator, 'userAgent', 'get').and.returnValue('A Desktop User Agent');
    expect(service.isMobile()).toBe(true);
  });

  it('should detect mobile via User-Agent string', () => {
    // Ensure no touch events
    delete (window as any).ontouchstart;
    spyOnProperty(navigator, 'userAgent', 'get').and.returnValue('iPhone');
    expect(service.isMobile()).toBe(true);
  });

  it('should NOT detect mobile for a desktop User-Agent without touch events', () => {
    // Ensure no touch events
    delete (window as any).ontouchstart;
    spyOnProperty(navigator, 'userAgent', 'get').and.returnValue('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
    expect(service.isMobile()).toBe(false);
  });
});
