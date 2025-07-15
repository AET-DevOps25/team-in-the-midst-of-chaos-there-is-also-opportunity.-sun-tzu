import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { QueueService } from '@app/services';

import { MainPageMobileComponent } from './main-page-mobile.component';

describe('MainPageMobileComponent', () => {
  let component: MainPageMobileComponent;
  let fixture: ComponentFixture<MainPageMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainPageMobileComponent, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        QueueService
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MainPageMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject QueueService', () => {
    expect(component.queueService).toBeTruthy();
  });
});
