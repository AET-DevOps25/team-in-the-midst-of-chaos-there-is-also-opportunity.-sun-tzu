import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AudioControlsComponent } from '../audio-controls/audio-controls.component';
import { PlayService, QueueService, ApiService } from '../../services';
import { signal } from '@angular/core';

describe('AudioControlsComponent', () => {
  let component: AudioControlsComponent;
  let fixture: ComponentFixture<AudioControlsComponent>;
  let playService: PlayService;

  beforeEach(async () => {
    // Define the mock inside beforeEach for true test isolation.
    // This creates a fresh mock for every single test.
    const mockPlayService = {
      isPlaying: signal(false),
      currentMetadata: signal(null),
      canPlay: signal(false),
      currentTime: signal(0),
      duration: signal(0),
      togglePlayPause: jasmine.createSpy('togglePlayPause'),
    };

    await TestBed.configureTestingModule({
      imports: [AudioControlsComponent, HttpClientTestingModule],
      providers: [
        { provide: PlayService, useValue: mockPlayService },
        QueueService,
        ApiService
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AudioControlsComponent);
    component = fixture.componentInstance;
    playService = TestBed.inject(PlayService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display "(No song selected)" when no metadata is available', () => {
    expect(component.currentMessage()).toBe('(No song selected)');
  });

  it('should display song information when metadata is available', () => {
    (playService.currentMetadata as any).set({ type: 'song', artist: 'Artist', title: 'Title', release_date: '2024' });
    fixture.detectChanges();
    expect(component.currentMessage()).toBe('Artist - Title (2024)');
  });

  it('should display "(Announcement)" when metadata type is announcement', () => {
    (playService.currentMetadata as any).set({ type: 'announcement' });
    fixture.detectChanges();
    expect(component.currentMessage()).toBe('(Announcement)');
  });

  it('should have 10 bars for the equalizer', () => {
    expect(component.bars().length).toBe(10);
  });

  it('should call togglePlayPause on togglePlay', () => {
    component.togglePlay();
    expect(playService.togglePlayPause).toHaveBeenCalled();
  });
});
