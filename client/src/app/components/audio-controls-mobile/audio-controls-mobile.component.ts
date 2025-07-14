import { Component, computed, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  ],
  templateUrl: './audio-controls-mobile.component.html',
  styleUrls: ['./audio-controls-mobile.component.scss']
})
export class AudioControlsMobileComponent {
  // Use inject() to get service instances, as in the original code
  playService = inject(PlayService);
  queueService = inject(QueueService);

  // --- SIGNALS based on the original working code ---

  // Separate signals for title and artist to match the new template
  currentTitle = computed(() => {
    const metadata = this.playService.currentMetadata();
    if (metadata?.type === 'song') {
      return metadata.title;
    }
    if (metadata?.type === 'announcement') {
      return '(Announcement)';
    }
    return 'No song selected';
  });

  currentArtist = computed(() => {
    const metadata = this.playService.currentMetadata();
    if (metadata?.type === 'song') {
      return metadata.artist;
    }
    return '...';
  });

  // Signal for the progress bar mode
  mode: Signal<ProgressBarMode> = computed(() => {
    return this.playService.canPlay() ? 'determinate' : 'buffer';
  });

  // Signal for the progress bar percentage
  progressPercent = computed(() => {
    const duration = this.playService.duration();
    if (duration === 0) return 0; // Avoid division by zero
    const percent = (this.playService.currentTime() / duration) * 100;
    return Math.min(percent, 100);
  });

  // Signal for the play/pause icon
  icon: Signal<string> = computed(() => {
    return this.playService.isPlaying() ? 'pause' : 'play_arrow';
  });

  // --- METHODS based on the original working code ---

  togglePlay() {
    this.playService.togglePlayPause();
  }

  toggleQueue() {
    this.queueService.toggleQueue();
  }
}
