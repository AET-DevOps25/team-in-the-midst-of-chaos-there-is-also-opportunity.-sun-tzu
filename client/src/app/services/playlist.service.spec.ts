import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SessionService } from './session.service';
import { PlaylistService } from './playlist.service';
import { of } from 'rxjs';
import { NewPlaylistDto } from '@app/dtos/new-playlist';

describe('PlaylistService', () => {
  let service: PlaylistService;
  let sessionService: SessionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SessionService, PlaylistService]
    });
    service = TestBed.inject(PlaylistService);
    sessionService = TestBed.inject(SessionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('newPlaylist', () => {
    it('should create a new playlist', () => {
      const mockPlaylist: NewPlaylistDto = { session: 123 };
      service.newPlaylist().subscribe(response => {
        if (response.success) {
          expect(response.data).toEqual(mockPlaylist);
        }
      });
      const req = httpMock.expectOne('/api/playlist/newPlaylist');
      expect(req.request.method).toBe('POST');
      req.flush(mockPlaylist);
    });
  });

  describe('addSong', () => {
    it('should add a song to a playlist', () => {
      const session = 123;
      const song = 456;
      service.addSong(session, song).subscribe(response => {
        expect(response.success).toBe(true);
      });
      const req = httpMock.expectOne(`/api/playlist/addSong?session=${session}&song=${song}`);
      expect(req.request.method).toBe('POST');
      req.flush({});
    });
  });
});
