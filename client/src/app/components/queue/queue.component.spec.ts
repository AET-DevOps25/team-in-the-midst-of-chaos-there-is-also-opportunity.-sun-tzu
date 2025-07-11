import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { QueueComponent } from './queue.component';
import { QueueService } from '@app/services/queue.service';

describe('QueueComponent', () => {
  let component: QueueComponent;
  let fixture: ComponentFixture<QueueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueueComponent, HttpClientTestingModule],
      providers: [QueueService]
    })
      .compileComponents();

    fixture = TestBed.createComponent(QueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
