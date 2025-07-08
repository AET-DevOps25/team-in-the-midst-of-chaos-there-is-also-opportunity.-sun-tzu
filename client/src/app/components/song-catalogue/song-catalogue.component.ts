import { Component, inject, OnInit } from '@angular/core';
import { PlaylistService } from '../../services/playlist.service';
import {MatListModule} from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { QueueService } from '@app/services/queue.service';


@Component({
  selector: 'app-song-catalogue',
  imports: [MatListModule, MatIconModule, MatButtonModule],
  templateUrl: './song-catalogue.component.html',
  styleUrl: './song-catalogue.component.scss'
})
export class SongCatalogueComponent implements OnInit {
  playlistService = inject(PlaylistService)
  queueService = inject(QueueService)

  ngOnInit(): void {
    this.queueService.updateAvailableSongs()
    this.queueService.updateNextAudios()
  }
}
