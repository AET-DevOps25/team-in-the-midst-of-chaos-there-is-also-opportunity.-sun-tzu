import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { QueueService } from '@app/services';
import { TrackLogo, TrackLogoService } from '@app/services/track-logo.service';

// Based on your services, the track object in the queue will have this structure.
// This avoids an import error since the DTO file was not provided.
export interface QueueAudioTrack {
  id: number;
  type: 'song' | 'announcement';
  title: string;
  artist?: string;
}

@Component({
  selector: 'app-queue',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    NgStyle
  ],
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.scss'],
})
export class QueueComponent implements OnInit {

  isHandset$: Observable<boolean>;
  public queueService = inject(QueueService);
  private breakpointObserver = inject(BreakpointObserver);
  private trackLogoService = inject(TrackLogoService);

  constructor() {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        shareReplay()
      );
  }

  ngOnInit(): void {
    // This assumes queueService fetches and updates the list of next audios.
    this.queueService.updateNextAudios().subscribe();
  }

  // The type is now corrected to QueueAudioTrack
  getSongLogo(song: QueueAudioTrack): TrackLogo {
    // The queue only shows upcoming songs, so the type is 'song'.
    return this.trackLogoService.getLogo(song.title, 'song');
  }

  closeQueue(): void {
    this.queueService.hideQueue();
  }
}
