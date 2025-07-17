import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { EqualizerComponent } from './equalizer.component';
import { PlayService } from '@app/services';
import { signal } from '@angular/core';

describe('EqualizerComponent', () => {
  let component: EqualizerComponent;
  let fixture: ComponentFixture<EqualizerComponent>;
  let playService: PlayService;

  beforeEach(async () => {
    // Mock PlayService with necessary signals
    const mockPlayService = {
      isPlaying: signal(false),
      currentMetadata: signal(null), // Add currentMetadata as a signal
      canPlay: signal(false), // Add canPlay as a signal if used
      currentTime: signal(0), // Add currentTime as a signal if used
      duration: signal(0), // Add duration as a signal if used
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, EqualizerComponent], // Ensure CommonModule is imported for NgStyle and @for
      providers: [
        { provide: PlayService, useValue: mockPlayService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EqualizerComponent);
    component = fixture.componentInstance;
    playService = TestBed.inject(PlayService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 20 bars', () => {
    expect(component.bars().length).toBe(20);
  });

  it('equalizer should have "playing" class when playService.isPlaying is true', () => {
    (playService.isPlaying as any).set(true); // Set the signal value
    (playService.currentMetadata as any).set({ type: 'song' }); // Set metadata to simulate a song playing
    fixture.detectChanges(); // Detect changes
    const compiled = fixture.nativeElement as HTMLElement;
    const equalizerDiv = compiled.querySelector('.equalizer-container'); // Corrected selector
    expect(equalizerDiv?.classList.contains('playing')).toBe(true);
  });

  it('equalizer should NOT have "playing" class when playService.isPlaying is false', () => {
    (playService.isPlaying as any).set(false); // Set the signal value
    (playService.currentMetadata as any).set({ type: 'song' }); // Still a song, but not playing
    fixture.detectChanges(); // Detect changes
    const compiled = fixture.nativeElement as HTMLElement;
    const equalizerDiv = compiled.querySelector('.equalizer-container'); // Corrected selector
    expect(equalizerDiv?.classList.contains('playing')).toBe(false);
  });

  it('equalizer should NOT have "playing" class when currentMetadata.type is not song', () => {
    (playService.isPlaying as any).set(true); // Is playing, but not a song
    (playService.currentMetadata as any).set({ type: 'announcement' });
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const equalizerDiv = compiled.querySelector('.equalizer-container');
    expect(equalizerDiv?.classList.contains('playing')).toBe(false);
  });
});
