import { Component, computed, inject, Signal } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { MatProgressBarModule, ProgressBarMode } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PlayService } from '@app/services';
import { QueueService } from '@app/services';

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

  // Define the same color palettes as the song catalogue
  private bgColorPalette: string[] = ['#e0e7ff', '#f3e8ff', '#fce7f3'];
  private textColorPalette: string[] = ['#4338ca', '#9333ea', '#db2777'];

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

  getTrackLogo = computed(() => {
    const metadata = this.playService.currentMetadata();
    const title = metadata?.title || '';
    if (!title || !metadata) {
      return { initials: '?', bgColor: '#e5e7eb', color: '#4b5563' };
    }

    if (metadata.type === 'announcement') {
      return { initials: 'AI', bgColor: '#dbeafe', color: '#1d4ed8' };
    }

    const initials = title.substring(0, 2).toUpperCase();
    const lastCharCode = title.charCodeAt(title.length - 1);
    const colorIndex = lastCharCode % this.bgColorPalette.length;

    return {
      initials,
      bgColor: this.bgColorPalette[colorIndex],
      color: this.textColorPalette[colorIndex]
    };
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
