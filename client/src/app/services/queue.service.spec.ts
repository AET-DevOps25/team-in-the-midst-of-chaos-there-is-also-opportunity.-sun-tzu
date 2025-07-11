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
});
