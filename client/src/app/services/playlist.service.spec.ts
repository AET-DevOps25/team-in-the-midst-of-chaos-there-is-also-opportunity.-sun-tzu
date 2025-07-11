import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SessionService, TOKEN_NAME } from './session.service';
import { PlaylistService } from './playlist.service';
import { of } from 'rxjs';

describe('SessionService', () => {
  let service: SessionService;
  let playlistService: PlaylistService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SessionService, PlaylistService]
    });
    service = TestBed.inject(SessionService);
    playlistService = TestBed.inject(PlaylistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a session', () => {
    spyOn(playlistService, 'newPlaylist').and.returnValue(of({ success: true, data: { session: 123 } }));
    service.createSession().subscribe(() => {
      expect(service.sessionToken).toBe('123');
      expect(service.hasSession()).toBe(true);
    });
  });

  it('should destroy a session', () => {
    service.sessionToken = '123';
    service.destroySession().subscribe(() => {
      expect(service.sessionToken).toBeNull();
      expect(service.hasSession()).toBe(false);
    });
  });
});
