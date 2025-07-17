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

});
