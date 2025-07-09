import { Component, inject, OnInit } from '@angular/core';
import { PlaylistService } from '../../services/playlist.service';
import {MatListModule} from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { QueueService } from '@app/services/queue.service';
import { SessionService } from '@app/services/session.service';
import { concatMap, concatWith } from 'rxjs';


@Component({
  selector: 'app-song-catalogue',
  imports: [MatListModule, MatIconModule, MatButtonModule],
  templateUrl: './song-catalogue.component.html',
  styleUrl: './song-catalogue.component.scss'
})
export class SongCatalogueComponent implements OnInit {
  playlistService = inject(PlaylistService)
  queueService = inject(QueueService)
  sessionService = inject(SessionService)

  ngOnInit(): void {
    const sub = this.queueService.updateAvailableSongs().subscribe()
  }

  addToQueue(songId: number) {
    const sub = this.playlistService.addSong(
      this.sessionService.sessionToken!, songId
    ).pipe(
      concatWith(this.queueService.updateNextAudios())
    ).subscribe()
  }
}
