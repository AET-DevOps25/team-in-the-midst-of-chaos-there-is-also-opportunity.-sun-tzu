import { Component, inject } from '@angular/core';
import {MatProgressBarModule, ProgressBarMode} from '@angular/material/progress-bar';
import { Signal, signal, computed } from '@angular/core';
import { PlayService } from '../../services';

@Component({
  selector: 'app-progress-bar',
  imports: [MatProgressBarModule],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss'
})
export class ProgressBarComponent {
  playService = inject(PlayService)

  mode: Signal<ProgressBarMode> = computed(() => {
    if (!this.playService.canPlay())
      return "buffer"
    return "determinate"
  })

  progressPercent = computed(() => {
    const percent = (this.playService.currentTime() / this.playService.duration()) * 100;
    return Math.min(percent, 100)
  })

}
