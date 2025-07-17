import { Component, computed, inject, Signal } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { MatProgressBarModule, ProgressBarMode } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PlayService } from '@app/services';
import { QueueService } from '@app/services';
import { TrackLogo, TrackLogoService } from '@app/services/track-logo.service';

@Component({
  selector: 'app-audio-controls-mobile',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBarModule,
    MatIconModule,
    MatButtonModule,
    NgStyle,
  ],
  templateUrl: './audio-controls-mobile.component.html',
  styleUrls: ['./audio-controls-mobile.component.scss']
})
export class AudioControlsMobileComponent {
  playService = inject(PlayService);
  queueService = inject(QueueService);
  trackLogoService = inject(TrackLogoService);

  // --- SIGNALS ---

  currentTitle = computed(() => {
    const metadata = this.playService.currentMetadata();
    if (metadata?.type === 'song') return metadata.title;
    if (metadata?.type === 'announcement') return 'Announcement';
    return 'No song selected';
  });

  currentArtist = computed(() => {
    const metadata = this.playService.currentMetadata();
    return metadata?.type === 'song' ? metadata.artist : '...';
  });

  trackLogo: Signal<TrackLogo> = computed(() => {
    const metadata = this.playService.currentMetadata();
    const title = metadata?.title || '';
    const type = metadata?.type || 'song';
    return this.trackLogoService.getLogo(title, type);
  });

  mode: Signal<ProgressBarMode> = computed(() => {
    return this.playService.canPlay() ? 'determinate' : 'buffer';
  });

  progressPercent = computed(() => {
    const duration = this.playService.duration();
    if (duration === 0) return 0;
    const percent = (this.playService.currentTime() / duration) * 100;
    return Math.min(percent, 100);
  });

  icon: Signal<string> = computed(() => {
    return this.playService.isPlaying() ? 'pause' : 'play_arrow';
  });

  // --- METHODS ---

  togglePlay(): void {
    this.playService.togglePlayPause();
  }

  toggleQueue(): void {
    this.queueService.toggleQueue();
  }
}
