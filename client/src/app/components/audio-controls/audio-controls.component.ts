import { Component, computed, Signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { PlayService } from '../../services/play.service';
import { inject } from '@angular/core';
import { ApiService } from '../../services/api.service';
import {MatProgressBarModule, ProgressBarMode} from '@angular/material/progress-bar';


@Component({
  selector: 'app-audio-controls',
  imports: [MatIconModule, MatButtonModule, MatProgressBarModule],
  templateUrl: './audio-controls.component.html',
  styleUrl: './audio-controls.component.scss'
})
export class AudioControlsComponent {
  playService = inject(PlayService)
  apiService = inject(ApiService)
  currentMessage: string = ""

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
    this.playService.greet().subscribe(r => {
      if (!r.success) throw Error(r.error)
      this.currentMessage = JSON.stringify(r.data)
    })
  }

}
