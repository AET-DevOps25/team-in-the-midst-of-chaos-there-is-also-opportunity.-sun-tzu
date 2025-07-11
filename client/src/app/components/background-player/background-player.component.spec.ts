import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BackgroundPlayerComponent } from './background-player.component';
import { PlayService } from '../../services';

describe('BackgroundPlayerComponent', () => {
  let component: BackgroundPlayerComponent;
  let fixture: ComponentFixture<BackgroundPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackgroundPlayerComponent, HttpClientTestingModule],
      providers: [PlayService]
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
