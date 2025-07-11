import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { QueueService } from './queue.service';
import { PlaylistService } from './playlist.service';
import { SessionService } from './session.service';

describe('QueueService', () => {
  let service: QueueService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [QueueService, PlaylistService, SessionService]
    });
    service = TestBed.inject(QueueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
