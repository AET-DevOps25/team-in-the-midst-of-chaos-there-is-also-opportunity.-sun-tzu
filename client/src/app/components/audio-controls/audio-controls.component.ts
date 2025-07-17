import { Component, computed, inject, Signal } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule, ProgressBarMode } from '@angular/material/progress-bar';
import { PlayService } from '../../services/play.service';
import { TrackLogo, TrackLogoService } from '@app/services/track-logo.service';

@Component({
  selector: 'app-audio-controls',
  standalone: true,
  imports: [CommonModule, NgStyle, MatIconModule, MatButtonModule, MatProgressBarModule],
  templateUrl: './audio-controls.component.html',
  styleUrls: ['./audio-controls.component.scss']  // ← fixed
})
export class AudioControlsComponent {
  playService = inject(PlayService);
  trackLogoService = inject(TrackLogoService);

  currentTitle = computed(() => {
    const m = this.playService.currentMetadata();
    if (m?.type === 'song') return m.title;
    if (m?.type === 'announcement') return 'Announcement';
    return 'No song selected';
  });

  currentArtist = computed(() => {
    const m = this.playService.currentMetadata();
    return m?.type === 'song' ? m.artist : '...';
  });

  trackLogo: Signal<TrackLogo> = computed(() => {
    const m = this.playService.currentMetadata();
    return this.trackLogoService.getLogo(m?.title || '', m?.type || 'song');
  });

  mode: Signal<ProgressBarMode> = computed(() => this.playService.canPlay() ? 'determinate' : 'buffer');
  progressPercent = computed(() => {
    const d = this.playService.duration();
    return d > 0 ? Math.min((this.playService.currentTime() / d) * 100, 100) : 0;
  });
  icon: Signal<string> = computed(() => this.playService.isPlaying() ? 'pause' : 'play_arrow');

  togglePlay() {
    this.playService.togglePlayPause();
  }
}
