import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PlayService, QueueService } from '@app/services';
import { AudioControlsMobileComponent } from './audio-controls-mobile.component';

describe('AudioControlsMobileComponent', () => {
  let component: AudioControlsMobileComponent;
  let fixture: ComponentFixture<AudioControlsMobileComponent>;

  // --- THIS IS THE FIX ---
  // Create mock objects for the services
  const mockPlayService = {
    isPlaying: () => false,
    currentMetadata: () => null,
    canPlay: () => false,
    currentTime: () => 0,
    duration: () => 0,
    togglePlayPause: () => {}
  };

  const mockQueueService = {
    toggleQueue: () => {}
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudioControlsMobileComponent, NoopAnimationsModule],
      // Provide the mock services
      providers: [
        { provide: PlayService, useValue: mockPlayService },
        { provide: QueueService, useValue: mockQueueService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AudioControlsMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
