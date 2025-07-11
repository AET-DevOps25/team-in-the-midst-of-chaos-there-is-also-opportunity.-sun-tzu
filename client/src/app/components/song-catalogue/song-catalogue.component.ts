import { Component, computed, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { PlaylistService } from '../../services/playlist.service';
import {MatListModule} from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { QueueService } from '@app/services/queue.service';
import { SessionService } from '@app/services/session.service';
import { concatMap, concatWith, EMPTY, of, tap } from 'rxjs';
import { MetadataDto } from '@app/dtos/get-metadata';
import { ScrollingModule } from '@angular/cdk/scrolling';


@Component({
  selector: 'app-song-catalogue',
  imports: [MatListModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, ScrollingModule],
  templateUrl: './song-catalogue.component.html',
  styleUrl: './song-catalogue.component.scss'
})
export class SongCatalogueComponent implements OnInit {
  playlistService = inject(PlaylistService)
  queueService = inject(QueueService)
  sessionService = inject(SessionService)

  availableAudios: WritableSignal<MetadataDto[]> = signal([])
  availableSongs = computed(() => {
    return this.availableAudios().filter(item => item.type == "song")
  })

  ngOnInit(): void {
    const sub = this.updateAvailableSongs("").subscribe()
  }

  addToQueue(songId: number) {
    const sub = this.playlistService.addSong(
      this.sessionService.sessionToken!, songId
    ).pipe(
      concatWith(this.queueService.updateNextAudios())
    ).subscribe()
  }

  updateAvailableSongs(filter: string) {
    return this.playlistService.findSong(filter).pipe(
      concatMap(r => {
        if (!r.success) throw r.error
        const audioIds = r.data.IDs
        console.log(r.data.IDs)
        if (audioIds.length == 0) return of(null)
        return this.playlistService.getMetadataMulti(r.data.IDs)
      }),
      tap(r => {
        if (r == null) {
          this.availableAudios.set([])
          return
        }
        if (!r.success) throw r.error
        this.availableAudios.set(r.data)
      })
    )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    const sub = this.updateAvailableSongs(filterValue).subscribe()
  }
}
