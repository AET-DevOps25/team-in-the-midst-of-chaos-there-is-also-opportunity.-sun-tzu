import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent, BackgroundPlayerComponent, AudioControlsComponent } from './components';
import { QueueComponent } from "./components/queue/queue.component";
import { SongCatalogueComponent } from './components/song-catalogue/song-catalogue.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, AudioControlsComponent, BackgroundPlayerComponent, QueueComponent, SongCatalogueComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'client';
}
