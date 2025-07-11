import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

// This path is now correct, assuming the file is in the right folder.
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
});
