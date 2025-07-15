import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SongCatalogueComponent } from './song-catalogue.component';
import { PlaylistService, QueueService, SessionService } from '@app/services';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SongCatalogueComponent', () => {
  let component: SongCatalogueComponent;
  let fixture: ComponentFixture<SongCatalogueComponent>;
  let playlistService: PlaylistService;
  let queueService: QueueService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SongCatalogueComponent, HttpClientTestingModule, NoopAnimationsModule],
      providers: [PlaylistService, QueueService, SessionService]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SongCatalogueComponent);
    component = fixture.componentInstance;
    playlistService = TestBed.inject(PlaylistService);
    queueService = TestBed.inject(QueueService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call updateAvailableSongs on init', () => {
    const spy = spyOn(component, 'updateAvailableSongs').and.returnValue(of());
    component.ngOnInit();
    expect(spy).toHaveBeenCalledWith('');
  });

  it('should call playlistService.addSong and queueService.updateNextAudios on addToQueue', () => {
    const addSongSpy = spyOn(playlistService, 'addSong').and.returnValue(of({ success: true, data: {} }));
    const updateQueueSpy = spyOn(queueService, 'updateNextAudios').and.returnValue(of([]));
    component.addToQueue(1);
    expect(addSongSpy).toHaveBeenCalled();
    expect(updateQueueSpy).toHaveBeenCalled();
  });

  it('should call updateAvailableSongs on applyFilter', () => {
    const spy = spyOn(component, 'updateAvailableSongs').and.returnValue(of());
    const event = { target: { value: 'test' } } as any;
    component.applyFilter(event);
    expect(spy).toHaveBeenCalledWith('test');
  });
});
