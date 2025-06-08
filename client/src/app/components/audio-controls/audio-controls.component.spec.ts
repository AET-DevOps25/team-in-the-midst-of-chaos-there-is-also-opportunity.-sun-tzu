import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioControlsComponent } from './audio-controls.component';

describe('PlayButtonComponent', () => {
  let component: AudioControlsComponent;
  let fixture: ComponentFixture<AudioControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudioControlsComponent]
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
