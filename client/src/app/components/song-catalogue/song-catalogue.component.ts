import { Component, inject } from '@angular/core';
import { PlaylistService } from '../../services/playlist.service';
import {MatListModule} from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-song-catalogue',
  imports: [MatListModule, MatIconModule, MatButtonModule],
  templateUrl: './song-catalogue.component.html',
  styleUrl: './song-catalogue.component.scss'
})
export class SongCatalogueComponent {
  playlistService = inject(PlaylistService)

}
