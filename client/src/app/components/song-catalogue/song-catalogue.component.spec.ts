import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SongCatalogueComponent } from './song-catalogue.component';
import { QueueService } from '../../services/queue.service';

describe('SongCatalogueComponent', () => {
  let component: SongCatalogueComponent;
  let fixture: ComponentFixture<SongCatalogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SongCatalogueComponent, HttpClientTestingModule],
      providers: [QueueService]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SongCatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
