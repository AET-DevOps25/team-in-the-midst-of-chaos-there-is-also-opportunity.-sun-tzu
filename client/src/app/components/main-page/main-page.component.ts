import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { HeaderComponent } from '../header/header.component';
import { BackgroundPlayerComponent } from '../background-player/background-player.component';
import { AudioControlsComponent } from '../audio-controls/audio-controls.component';
import { QueueComponent } from '../queue/queue.component';
import { SongCatalogueComponent } from '../song-catalogue/song-catalogue.component';
import { EqualizerComponent } from '../equalizer/equalizer.component';
import { PlayService } from '@app/services/play.service';
import { QueueService } from '@app/services/queue.service';

@Component({
  selector: 'app-main-page',
  standalone: true,                 // ← added
  imports: [
    MatDividerModule,
    HeaderComponent,
    BackgroundPlayerComponent,
    AudioControlsComponent,
    QueueComponent,
    SongCatalogueComponent,
    EqualizerComponent
  ],
  providers: [PlayService, QueueService],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']  // ← fixed
})
export class MainPageComponent { }
