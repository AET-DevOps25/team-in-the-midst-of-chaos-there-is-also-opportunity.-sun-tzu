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
  currentMessage = computed(() => {
    const track = this.playService.track()
    if (track == null) return "(No song selected)"

    switch (track.type) {
      case TrackType.Song:
        return `${track.artist} - ${track.title} (${track.year})`
      case TrackType.Announcement:
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
