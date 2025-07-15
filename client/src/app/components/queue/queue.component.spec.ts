import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { QueueComponent } from './queue.component';
import { QueueService } from '@app/services/queue.service';
import { of } from 'rxjs';

describe('QueueComponent', () => {
  let component: QueueComponent;
  let fixture: ComponentFixture<QueueComponent>;
  let queueService: QueueService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueueComponent, HttpClientTestingModule],
      providers: [QueueService]
    })
      .compileComponents();

    fixture = TestBed.createComponent(QueueComponent);
    component = fixture.componentInstance;
    queueService = TestBed.inject(QueueService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call updateNextAudios on init', () => {
    const spy = spyOn(queueService, 'updateNextAudios').and.returnValue(of([]));
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should call hideQueue on closeQueue', () => {
    const spy = spyOn(queueService, 'hideQueue');
    component.closeQueue();
    expect(spy).toHaveBeenCalled();
  });
});
