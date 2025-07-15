import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { QueueService } from './queue.service';
import { PlaylistService } from './playlist.service';
import { SessionService } from './session.service';
import { NextAudiosDto } from '@app/dtos/next-audios';
import { MetadataDto } from '@app/dtos/get-metadata';

describe('QueueService', () => {
  let service: QueueService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [QueueService, PlaylistService, SessionService]
    });
    service = TestBed.inject(QueueService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update next audios', () => {
    const mockNextAudios: NextAudiosDto = { audio: [1, 2, 3] };
    const mockMetadata: MetadataDto[] = [
      { id: 1, type: 'song', title: 'Song 1', artist: 'Artist 1', release_date: '2024', genre: 'Pop' },
      { id: 2, type: 'song', title: 'Song 2', artist: 'Artist 2', release_date: '2024', genre: 'Rock' },
      { id: 3, type: 'announcement', title: 'Announcement', artist: '', release_date: '', genre: '' }
    ];
    service.sessionService.sessionToken = 'test-token';
    service.updateNextAudios().subscribe(() => {
      expect(service.nextAudios()).toEqual(mockMetadata);
    });

    const req1 = httpMock.expectOne('/api/playlist/nextAudios?session=test-token');
    expect(req1.request.method).toBe('GET');
    req1.flush(mockNextAudios);

    const req2 = httpMock.expectOne('/api/playlist/metadataMulti?ids=1&ids=2&ids=3');
    expect(req2.request.method).toBe('GET');
    req2.flush(mockMetadata);
  });

  // --- New and Updated Tests ---

  it('should have showQueue signal initially as false', () => {
    expect(service.showQueue()).toBe(false);
  });

  it('should toggle showQueue from false to true when toggleQueue is called', () => {
    expect(service.showQueue()).toBe(false);
    service.toggleQueue();
    expect(service.showQueue()).toBe(true);
  });

  it('should toggle showQueue from true back to false when toggleQueue is called twice', () => {
    service.toggleQueue(); // -> true
    service.toggleQueue(); // -> false
    expect(service.showQueue()).toBe(false);
  });

  // --- Test for hideQueue() method ---
  it('should set showQueue to false when hideQueue is called', () => {
    // First, set it to true
    service.showQueue.set(true);
    expect(service.showQueue()).toBe(true);

    // Now, call hideQueue
    service.hideQueue();

    // Expect the state to be false
    expect(service.showQueue()).toBe(false);
  });
});
