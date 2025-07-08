import { inject, Injectable, Signal, WritableSignal, signal } from '@angular/core';
import { MetadataDto } from '@app/dtos/get-metadata';
import { PlaylistService } from './playlist.service';
import { SessionService } from './session.service';
import { NextAudiosDto } from '@app/dtos/next-audios';
import { concatMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QueueService {
  playlistService = inject(PlaylistService)
  sessionService = inject(SessionService)
  
  availableSongs: WritableSignal<MetadataDto[]> = signal([])
  nextAudios: WritableSignal<MetadataDto[]> = signal([])

  updateNextAudios() {
    const sub = this.playlistService.getNextAudios(this.sessionService.sessionToken!).pipe(
      concatMap(r => {
        if (!r.success) throw r.error
        return this.playlistService.getMetadataMulti(r.data.audio)
      }),
      tap(r => {
        if (!r.success) throw r.error
        this.nextAudios.set(r.data)
      })
    ).subscribe()
  }

  updateAvailableSongs() {
    const sub = this.playlistService.findSong("").pipe(
      concatMap(r => {
        if (!r.success) throw r.error
        return this.playlistService.getMetadataMulti(r.data.IDs)
      }),
      tap(r => {
        if (!r.success) throw r.error
        this.availableSongs.set(r.data)
      })
    ).subscribe()
  }


}
