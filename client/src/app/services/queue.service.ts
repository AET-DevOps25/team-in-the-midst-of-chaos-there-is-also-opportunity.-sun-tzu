import { inject, Injectable, signal, computed } from '@angular/core';
import { MetadataDto } from '@app/dtos/get-metadata';
import { PlaylistService } from './playlist.service';
import { SessionService } from './session.service';
import { concatMap, tap } from 'rxjs';

@Injectable()
export class QueueService {
  playlistService = inject(PlaylistService);
  sessionService = inject(SessionService);

  showQueue = signal(false); // New signal to control queue visibility
  nextAudios = signal<MetadataDto[]>([]);
  nextSongs = computed(() => {
    return this.nextAudios().slice(1).filter(item => item.type === "song");
  });

  updateNextAudios() {
    return this.playlistService.getNextAudios(this.sessionService.sessionToken!).pipe(
      concatMap(r => {
        if (!r.success) throw r.error;
        return this.playlistService.getMetadataMulti(r.data.audio);
      }),
      tap(r => {
        if (!r.success) throw r.error;
        this.nextAudios.set(r.data);
      })
    );
  }

  // New method to toggle the queue
  toggleQueue() {
    this.showQueue.update(v => !v);
  }
}
