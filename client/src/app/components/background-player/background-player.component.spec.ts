import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BackgroundPlayerComponent } from './background-player.component';
import { PlayService, ApiService } from '../../services';
import { PlaylistService } from '@app/services/playlist.service';
import { SessionService } from '@app/services/session.service';
import { QueueService } from '@app/services/queue.service';

describe('BackgroundPlayerComponent', () => {
  let component: BackgroundPlayerComponent;
  let fixture: ComponentFixture<BackgroundPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackgroundPlayerComponent, HttpClientTestingModule],
      providers: [PlayService, ApiService, PlaylistService, SessionService, QueueService]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BackgroundPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
