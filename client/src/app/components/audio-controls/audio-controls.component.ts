import { Component, computed, effect, ElementRef, signal, Signal, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { PlayService } from '../../services/play.service';
import { inject } from '@angular/core';
import { ApiService } from '../../services/api.service';
import {MatProgressBar, MatProgressBarModule, ProgressAnimationEnd, ProgressBarMode} from '@angular/material/progress-bar';
import { TrackType } from '../../interfaces/track';


@Component({
  selector: 'app-audio-controls',
  imports: [MatIconModule, MatButtonModule, MatProgressBarModule],
  templateUrl: './audio-controls.component.html',
  styleUrl: './audio-controls.component.scss'
})
export class AudioControlsComponent {
  playService = inject(PlayService)
  apiService = inject(ApiService)

  bars = Array.from({ length: 10 }, (_, i) => ({
    delay: Math.random() * 1 // Random delay to desync animation
  }));

  currentMessage = computed(() => {
    const metadata = this.playService.currentMetadata()
    if (metadata == null) return "(No song selected)"

    switch (metadata.type) {
      case "song":
        return `${metadata.artist} - ${metadata.title} (${metadata.release_date})`
      case "announcement":
        return "(Announcement)"
    }
  })

  mode: Signal<ProgressBarMode> = computed(() => {
    if (!this.playService.canPlay())
      return "buffer"
    return "determinate"
  })

  progressPercent = computed(() => {
    const percent = (this.playService.currentTime() / this.playService.duration()) * 100;
    return Math.min(percent, 100)
  })

  icon: Signal<string> = computed(() => {
    if (this.playService.isPlaying())
      return "pause"
    return "play_arrow"
  })

  togglePlay() {
    this.playService.togglePlayPause()
  }

}
