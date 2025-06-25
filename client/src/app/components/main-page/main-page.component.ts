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


@Component({
  selector: 'app-main-page',
  imports: [
    RouterOutlet,
    MatDividerModule,
    HeaderComponent,
    AudioControlsComponent,
    BackgroundPlayerComponent,
    QueueComponent,
    SongCatalogueComponent
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {

}
