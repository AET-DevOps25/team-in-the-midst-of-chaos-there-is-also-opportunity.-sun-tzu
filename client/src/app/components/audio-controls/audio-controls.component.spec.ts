import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AudioControlsComponent } from './audio-controls.component';
import { PlayService, QueueService, ApiService } from '../../services';
import { signal } from '@angular/core';

describe('AudioControlsComponent', () => {
  let component: AudioControlsComponent;
  let fixture: ComponentFixture<AudioControlsComponent>;
  let playService: PlayService;

  // Define a setup function to create a fresh environment for each test
  const setup = async () => {
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
    }).compileComponents();

    fixture = TestBed.createComponent(AudioControlsComponent);
    component = fixture.componentInstance;
    playService = TestBed.inject(PlayService);
  };

  beforeEach(async () => {
    await setup();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display "(No song selected)" when no metadata is available', () => {
    // Arrange: State is already null from the fresh setup
    // Act: Initialize the component for this specific test
    fixture.detectChanges();
    // Assert
    expect(component.currentMessage()).toBe('(No song selected)');
  });

  it('should display song information when metadata is available', () => {
    // Arrange: Set the desired state for this specific test
    (playService.currentMetadata as any).set({ type: 'song', artist: 'Artist', title: 'Title', release_date: '2024' });
    // Act: Initialize the component
    fixture.detectChanges();
    // Assert
    expect(component.currentMessage()).toBe('Artist - Title (2024)');
  });

  it('should display "(Announcement)" when metadata type is announcement', () => {
    // Arrange
    (playService.currentMetadata as any).set({ type: 'announcement' });
    // Act
    fixture.detectChanges();
    // Assert
    expect(component.currentMessage()).toBe('(Announcement)');
  });

  it('should have 10 bars for the equalizer', () => {
    fixture.detectChanges();
    expect(component.bars().length).toBe(10);
  });

  it('should call togglePlayPause on togglePlay', () => {
    fixture.detectChanges();
    component.togglePlay();
    expect(playService.togglePlayPause).toHaveBeenCalled();
  });
});
