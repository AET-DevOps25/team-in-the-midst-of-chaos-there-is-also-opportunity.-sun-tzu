import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { WelcomePageComponent } from './welcome-page.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('WelcomePageComponent', () => {
  let component: WelcomePageComponent;
  let fixture: ComponentFixture<WelcomePageComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomePageComponent, HttpClientTestingModule, RouterTestingModule.withRoutes([])]
    })
      .compileComponents();

    fixture = TestBed.createComponent(WelcomePageComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isLoading to true and navigate on click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.onClick();
    expect(component.isLoading()).toBe(true);
    expect(navigateSpy).toHaveBeenCalledWith(['/player']);
  });
});
