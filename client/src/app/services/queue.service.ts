import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { PlaylistService } from './playlist.service';
import { SessionService } from './session.service';
import { NextAudiosDto } from '@app/dtos/next-audios';
import { MetadataDto } from '@app/dtos/get-metadata';

@Injectable({
  providedIn: 'root'
})
export class QueueService {
  // --- SIGNALS ---

  /** Signal holding the list of upcoming songs/audios. */
  public nextAudios: WritableSignal<MetadataDto[]> = signal([]);

  /** Signal to control the visibility of the queue overlay. */
  public showQueue: WritableSignal<boolean> = signal(false);

  // --- DEPS ---

  constructor(
    private http: HttpClient,
    public playlistService: PlaylistService,
    public sessionService: SessionService
  ) {}

  // --- METHODS ---

  /**
   * Fetches the next audio IDs from the playlist and then their metadata.
   * Updates the `nextAudios` signal with the result.
   */
  updateNextAudios(): Observable<MetadataDto[]> {
    const sessionToken = this.sessionService.sessionToken;
    return this.http.get<NextAudiosDto>(`/api/playlist/nextAudios?session=${sessionToken}`).pipe(
      switchMap(nextAudios => {
        if (!nextAudios.audio || nextAudios.audio.length === 0) {
          return new Observable<MetadataDto[]>(subscriber => subscriber.next([]));
        }
        const ids = nextAudios.audio.map(id => `ids=${id}`).join('&');
        return this.http.get<MetadataDto[]>(`/api/playlist/metadataMulti?${ids}`);
      }),
      tap(metadata => {
        this.nextAudios.set(metadata);
      })
    );
  }

  /**
   * Toggles the visibility of the upcoming songs queue.
   */
  toggleQueue(): void {
    this.showQueue.update(showing => !showing);
  }

  /**
   * Explicitly hides the upcoming songs queue.
   */
  hideQueue(): void {
    this.showQueue.set(false);
  }
}
