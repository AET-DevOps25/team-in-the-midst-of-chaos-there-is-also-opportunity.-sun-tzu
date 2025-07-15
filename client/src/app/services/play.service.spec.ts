import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PlayService } from './play.service';
import { ApiService } from './api.service';
import { PlaylistService } from './playlist.service';
import { SessionService } from './session.service';
import { QueueService } from './queue.service';
import { of } from 'rxjs';

describe('PlayService', () => {
  let service: PlayService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PlayService, ApiService, PlaylistService, SessionService, QueueService]
    });
    service = TestBed.inject(PlayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should toggle play/pause state', () => {
    expect(service.isPlaying()).toBe(false);
    service.togglePlayPause();
    expect(service.isPlaying()).toBe(true);
    service.togglePlayPause();
    expect(service.isPlaying()).toBe(false);
  });

  it('should set audioId and streamUrl', (done) => {
    spyOn(service['playlist'], 'getMetadata').and.returnValue(of({
      success: true,
      data: { id: 123, type: 'song', title: 'test', artist: 'test', release_date: '2024', genre: 'test' }
    }));

    service.setAudioId(123);
    expect(service.audioId()).toBe(123);
    expect(service.streamUrl()).toContain('/api/stream/audio?id=123');
    done();
  });
});
