import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';

import {
  HeaderComponent,
  BackgroundPlayerComponent,
  AudioControlsComponent,
  QueueComponent,
  SongCatalogueComponent
} from '@app/components';
import { PlayService } from '@app/services';
import { QueueService } from '@app/services/queue.service';


@Component({
  selector: 'app-main-page',
  imports: [
    MatDividerModule,
    HeaderComponent,
    AudioControlsComponent,
    BackgroundPlayerComponent,
    QueueComponent,
    SongCatalogueComponent
  ],
  providers: [PlayService, QueueService],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {

}
