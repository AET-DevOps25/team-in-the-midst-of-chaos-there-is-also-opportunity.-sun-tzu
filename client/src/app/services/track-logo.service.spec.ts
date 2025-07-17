import { TestBed } from '@angular/core/testing';
import { TrackLogoService } from './track-logo.service';

describe('TrackLogoService', () => {
  let service: TrackLogoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrackLogoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getLogo', () => {
    it('should return an icon for type "announcement"', () => {
      const logo = service.getLogo('Test Announcement', 'announcement');
      expect(logo.isIcon).toBeTrue();
      expect(logo.icon).toBe('person');
      expect(logo.bgColor).toBe('#dbeafe');
      expect(logo.color).toBe('#1d4ed8');
      expect(logo.initials).toBeUndefined();
    });

    it('should return default values for an empty song title', () => {
      const logo = service.getLogo('', 'song');
      expect(logo.isIcon).toBeFalse();
      expect(logo.initials).toBe('?');
      expect(logo.bgColor).toBe('#e5e7eb');
      expect(logo.color).toBe('#4b5563');
      expect(logo.icon).toBeUndefined();
    });

    it('should return initials and colors for a song title', () => {
      const logo = service.getLogo('My Awesome Song', 'song');
      expect(logo.isIcon).toBeFalse();
      expect(logo.initials).toBe('MY');
      expect(logo.bgColor).toBeDefined(); // Will vary based on charCode
      expect(logo.color).toBeDefined();   // Will vary based on charCode
      expect(logo.icon).toBeUndefined();
    });

    it('should generate initials from the first two characters of the title', () => {
      const logo = service.getLogo('Another Song', 'song');
      expect(logo.initials).toBe('AN');
    });

    it('should convert initials to uppercase', () => {
      const logo = service.getLogo('lower song', 'song');
      expect(logo.initials).toBe('LO');
    });

    it('should use the last character code to determine color palette index', () => {
      // Test for a specific character to hit a known index in the palette
      const titles = [
        'SongA', // 'A' -> 65 % 3 = 2 -> palette index 2
        'SongB', // 'B' -> 66 % 3 = 0 -> palette index 0
        'SongC', // 'C' -> 67 % 3 = 1 -> palette index 1
      ];

      const expectedBgColors = ['#fce7f3', '#e0e7ff', '#f3e8ff'];
      const expectedTextColors = ['#db2777', '#4338ca', '#9333ea'];

      // Note: The order of expected colors corresponds to title ending characters A, B, C, etc.
      // A (65) % 3 = 2
      // B (66) % 3 = 0
      // C (67) % 3 = 1

      const logoA = service.getLogo(titles[0], 'song');
      expect(logoA.bgColor).toBe(expectedBgColors[0]);
      expect(logoA.color).toBe(expectedTextColors[0]);

      const logoB = service.getLogo(titles[1], 'song');
      expect(logoB.bgColor).toBe(expectedBgColors[1]);
      expect(logoB.color).toBe(expectedTextColors[1]);

      const logoC = service.getLogo(titles[2], 'song');
      expect(logoC.bgColor).toBe(expectedBgColors[2]);
      expect(logoC.color).toBe(expectedTextColors[2]);
    });
  });
});
