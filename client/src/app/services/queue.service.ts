import { inject, Injectable, Signal, WritableSignal, signal, computed } from '@angular/core';
import { MetadataDto } from '@app/dtos/get-metadata';
import { PlaylistService } from './playlist.service';
import { SessionService } from './session.service';
import { NextAudiosDto } from '@app/dtos/next-audios';
import { concatMap, filter, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QueueService {
  playlistService = inject(PlaylistService)
  sessionService = inject(SessionService)
  
  availableAudios: WritableSignal<MetadataDto[]> = signal([])
  availableSongs = computed(() => {
    return this.availableAudios().filter(item => item.type == "song")
  })

  nextAudios: WritableSignal<MetadataDto[]> = signal([])
  nextSongs = computed(() => {
    return this.nextAudios().slice(1).filter(item => item.type == "song")
  })

  updateNextAudios() {
    return this.playlistService.getNextAudios(this.sessionService.sessionToken!).pipe(
      concatMap(r => {
        if (!r.success) throw r.error
        return this.playlistService.getMetadataMulti(r.data.audio)
      }),
      tap(r => {
        if (!r.success) throw r.error
        this.nextAudios.set(r.data)
      })
    )
  }

  updateAvailableSongs() {
    return this.playlistService.findSong("").pipe(
      concatMap(r => {
        if (!r.success) throw r.error
        return this.playlistService.getMetadataMulti(r.data.IDs)
      }),
      tap(r => {
        if (!r.success) throw r.error
        this.availableAudios.set(r.data)
      })
    )
  }


}
