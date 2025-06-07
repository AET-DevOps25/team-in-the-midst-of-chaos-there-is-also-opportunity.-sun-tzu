import { computed, inject, Injectable } from '@angular/core';
import { signal } from '@angular/core';
import { Observable, single } from 'rxjs';
import { ApiResponse } from '../interfaces';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class PlayService {
  api = inject(ApiService)
  private _isPlaying = signal(false)
  readonly isPlaying = this._isPlaying.asReadonly()
  currentTime = signal(0)
  duration = signal(0)
  canPlay = signal(false)
  
  private _audioId = signal<number | null>(1);
  readonly audioId = this._audioId.asReadonly();

  setAudioId(id: number|null) {
    this._audioId.set(id);
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