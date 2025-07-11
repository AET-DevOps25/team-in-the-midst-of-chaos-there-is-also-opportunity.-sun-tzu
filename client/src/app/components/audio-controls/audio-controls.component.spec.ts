import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AudioControlsComponent } from './audio-controls.component';
import { PlayService } from '../../services';

describe('AudioControlsComponent', () => {
  let component: AudioControlsComponent;
  let fixture: ComponentFixture<AudioControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudioControlsComponent, HttpClientTestingModule],
      providers: [PlayService]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AudioControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
