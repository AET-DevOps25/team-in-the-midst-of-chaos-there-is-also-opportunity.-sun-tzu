import { computed, effect, inject, Injectable, OnInit } from '@angular/core';
import { signal } from '@angular/core';
import { concatMap, concatWith, Observable, of, single, tap } from 'rxjs';
import { ApiResponse } from '../interfaces';
import { ApiService } from './api.service';
import { Song, Track } from '../interfaces/track';
import { PlaylistService } from './playlist.service';
import { SessionService } from './session.service';
import { MetadataDto } from '@app/dtos/get-metadata';
import { E } from '@angular/cdk/keycodes';
import { QueueService } from './queue.service';

@Injectable()
export class PlayService {
  api = inject(ApiService)
  playlist = inject(PlaylistService)
  sessionService = inject(SessionService)
  queueService = inject(QueueService)

  private _isPlaying = signal(false)
  readonly isPlaying = this._isPlaying.asReadonly()
  currentTime = signal(0)
  duration = signal(0)
  canPlay = signal(false)
  
  private _audioId = signal<number | null>(null);
  readonly audioId = this._audioId.asReadonly();

  private _currentMetadata = signal<MetadataDto | null>(null)
  readonly currentMetadata = this._currentMetadata.asReadonly()


  syncAudioId() {
    const sessionToken = this.sessionService.sessionToken
    if (sessionToken == null)
      throw Error("Session token cannot be null")
    return this.playlist.currentAudio(sessionToken).pipe(
      tap(r => {
        if (!r.success) throw r.error
        this.setAudioId(r.data.audio)
      })
    )
  }

  setAudioId(id: number|null) {
    if (id == null) {
      this._audioId.set(null)
      this._currentMetadata.set(null)
      this.canPlay.set(false)
      return
    }

    this._audioId.set(id);
    const sub = this.playlist.getMetadata(id).pipe(
      tap(r => {
        if (!r.success) throw r.error
        this._currentMetadata.set(r.data)
      })
    ).subscribe()
  }


  play() {
    this._isPlaying.set(true)
  }

  pause() {
    this._isPlaying.set(false)
  }

  togglePlayPause() {
    this._isPlaying.update(v => !v)
  }

  trackFinished() {
    console.log("The track has finished")
    this.setAudioId(null)

    const sessionToken = this.sessionService.sessionToken!
    const sub = this.playlist.removeHead(sessionToken).pipe(
      concatWith(this.syncAudioId()),
      concatWith(this.queueService.updateNextAudios())
    ).subscribe()
  }

  readonly streamUrl = computed(() => {
    const id = this._audioId();
    return id != null
      ? `${this.api.baseUrl}/stream/audio?id=${id}`
      : null;
  });

  greet(): Observable<ApiResponse<
    string,
    never
  >> {
    return this.api.get('/playlist/greet')
  }

}