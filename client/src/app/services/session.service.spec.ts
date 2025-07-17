import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SessionService, TOKEN_NAME } from './session.service';
import { PlaylistService } from './playlist.service';
import { of } from 'rxjs';
import { NewPlaylistDto } from '@app/dtos/new-playlist';

describe('SessionService', () => {
  let service: SessionService;
  let playlistService: PlaylistService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SessionService, PlaylistService]
    });
    service = TestBed.inject(SessionService);
    playlistService = TestBed.inject(PlaylistService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a session', () => {
    const mockPlaylist: NewPlaylistDto = { session: 123 };
    spyOn(playlistService, 'newPlaylist').and.returnValue(of({ success: true, data: mockPlaylist }));
    service.createSession().subscribe(() => {
      expect(service.sessionToken).toBe('123');
      expect(service.hasSession()).toBe(true);
    });
  });

  it('should destroy a session', (done) => { // Added 'done' parameter
    service.sessionToken = '123';
    service.destroySession().subscribe(() => {
      expect(service.sessionToken).toBeNull();
      expect(service.hasSession()).toBe(false);
      done(); // Call done() to signal completion
    });
  });
});
