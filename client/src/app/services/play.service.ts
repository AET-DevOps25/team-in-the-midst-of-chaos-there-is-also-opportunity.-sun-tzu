import { computed, inject, Injectable } from '@angular/core';
import { signal } from '@angular/core';
import { Observable, single } from 'rxjs';
import { ApiResponse } from '../interfaces';
import { ApiService } from './api.service';
import { Song, Track } from '../interfaces/track';
import { PlaylistService } from './playlist.service';

@Injectable({
  providedIn: 'root'
})
export class PlayService {
  api = inject(ApiService)
  playlist = inject(PlaylistService)

  private _isPlaying = signal(false)
  readonly isPlaying = this._isPlaying.asReadonly()
  currentTime = signal(0)
  duration = signal(0)
  canPlay = signal(false)
  
  private _audioId = signal<number | null>(null);
  readonly audioId = this._audioId.asReadonly();

  private _track = signal<Track | null>(null)
  readonly track = this._track.asReadonly()

  readonly x = setTimeout(() => {
    this.setAudioId(1)
  }, 3000)


  setAudioId(id: number|null) {
    if (id == null) {
      this._audioId.set(null)
      this._track.set(null)
      this.canPlay.set(false)
      return
    }

    this._audioId.set(id);
    this._track.set(this.playlist.getTrack(id))
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
    setTimeout(() => {
      this.setAudioId(1)
    }, 3000)
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