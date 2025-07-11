import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayService, QueueService } from '@app/services';

import { BackgroundPlayerComponent } from '../background-player/background-player.component';
import { SongCatalogueComponent } from '../song-catalogue/song-catalogue.component';
import { QueueComponent } from '../queue/queue.component';
import { HeaderComponent } from '../header/header.component';
// Import the new mobile-specific component
import { AudioControlsMobileComponent } from '../audio-controls-mobile/audio-controls-mobile.component';

@Component({
  selector: 'app-main-page-mobile',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    BackgroundPlayerComponent,
    SongCatalogueComponent,
    QueueComponent,
    AudioControlsMobileComponent, // Use the new mobile component
  ],
  templateUrl: './main-page-mobile.component.html',
  styleUrls: ['./main-page-mobile.component.scss'],
  providers: [PlayService, QueueService],
})
export class MainPageMobileComponent {
  public queueService = inject(QueueService);
}
