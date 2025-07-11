import { Component, computed, inject, Signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule, ProgressBarMode } from '@angular/material/progress-bar';
import { PlayService } from '@app/services/play.service';
import { QueueService } from '@app/services/queue.service';

@Component({
  selector: 'app-audio-controls-mobile',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatProgressBarModule],
  templateUrl: './audio-controls-mobile.component.html',
  styleUrl: './audio-controls-mobile.component.scss'
})
export class AudioControlsMobileComponent {
  playService = inject(PlayService);
  queueService = inject(QueueService);

  currentMessage = computed(() => {
    const metadata = this.playService.currentMetadata();
    if (metadata == null) return "No song selected";
    if (metadata.type === 'announcement') return "(Announcement)";
    return `${metadata.artist} - ${metadata.title}`;
  });

  mode: Signal<ProgressBarMode> = computed(() => {
    return this.playService.canPlay() ? 'determinate' : 'buffer';
  });

  progressPercent = computed(() => {
    const percent = (this.playService.currentTime() / this.playService.duration()) * 100;
    return Math.min(percent, 100);
  });

  icon: Signal<string> = computed(() => {
    return this.playService.isPlaying() ? 'pause' : 'play_arrow';
  });

  togglePlay() {
    this.playService.togglePlayPause();
  }

  toggleQueue() {
    this.queueService.toggleQueue();
  }
}
