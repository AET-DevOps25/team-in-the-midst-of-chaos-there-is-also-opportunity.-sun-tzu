import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongCatalogueComponent } from './song-catalogue.component';

describe('SongCatalogueComponent', () => {
  let component: SongCatalogueComponent;
  let fixture: ComponentFixture<SongCatalogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SongCatalogueComponent]
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
