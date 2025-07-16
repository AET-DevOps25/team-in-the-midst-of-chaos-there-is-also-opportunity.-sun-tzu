import { Component, computed, Signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PlayService } from '../../services/play.service';
import { inject } from '@angular/core';
import { MatProgressBarModule, ProgressBarMode } from '@angular/material/progress-bar';

@Component({
  selector: 'app-audio-controls',
  imports: [MatIconModule, MatButtonModule, MatProgressBarModule],
  templateUrl: './audio-controls.component.html',
  styleUrl: './audio-controls.component.scss'
})
export class AudioControlsComponent {
  playService = inject(PlayService);

  currentTrackTitle = computed(() => {
    const metadata = this.playService.currentMetadata();
    if (metadata?.type === 'song') {
      return metadata.title;
    }
    if (metadata?.type === 'announcement') {
      return 'Announcement';
    }
    return ' '; // Use a non-breaking space as a placeholder
  });

  currentTrackArtist = computed(() => {
    const metadata = this.playService.currentMetadata();
    if (metadata?.type === 'song') {
      return metadata.artist;
    }
    return ' '; // Use a non-breaking space as a placeholder
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
}
