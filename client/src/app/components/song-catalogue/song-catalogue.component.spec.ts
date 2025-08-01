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
import { NgStyle } from '@angular/common';


@Component({
  selector: 'app-song-catalogue',
  imports: [MatListModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, NgStyle],
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

  // New vibrant red-to-blue color palettes
  private bgColorPalette: string[] = ['#fee2e2', '#fce7f3', '#f3e8ff', '#e0e7ff', '#dbeafe'];
  private textColorPalette: string[] = ['#b91c1c', '#db2777', '#8b5cf6', '#3730a3', '#1d4ed8'];


  ngOnInit(): void {
    this.updateAvailableSongs("").subscribe()
  }

  getSongLogo(title: string): { initials: string, bgColor: string, color: string } {
    if (!title) {
      return { initials: '?', bgColor: '#e5e7eb', color: '#4b5563' };
    }
    const initials = title.substring(0, 2).toUpperCase();
    const lastCharCode = title.charCodeAt(title.length - 1);
    const colorIndex = lastCharCode % this.bgColorPalette.length;
    const bgColor = this.bgColorPalette[colorIndex];
    const color = this.textColorPalette[colorIndex];
    return { initials, bgColor, color };
  }

  addToQueue(songId: number) {
    this.playlistService.addSong(
      this.sessionService.sessionToken!, songId
    ).pipe(
      concatWith(this.queueService.updateNextAudios())
    ).subscribe()
  }

  updateAvailableSongs(filter: string) {
    return this.playlistService.findSong(filter).pipe(
      concatMap(r => {
        if (!r.success) throw r.error
        const audioIds = r.data.IDs;
        if (audioIds.length == 0) return of(null);
        return this.playlistService.getMetadataMulti(r.data.IDs);
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
    this.updateAvailableSongs(filterValue).subscribe()
  }
}
