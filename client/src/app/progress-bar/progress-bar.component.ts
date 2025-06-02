import { Component, inject } from '@angular/core';
import {MatProgressBarModule, ProgressBarMode} from '@angular/material/progress-bar';
import { PlayService } from '../play.service';
import { Signal, signal, computed } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  imports: [MatProgressBarModule],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss'
})
export class ProgressBarComponent {
  playService = inject(PlayService)

  mode: Signal<ProgressBarMode> = computed(() => {
    if (this.playService.isPlaying())
      return "determinate"
    return "determinate"
  })

  duration = 180
  progress = signal(0)
  progressPercent = computed(() => {
    const percent = (this.progress() / this.duration) * 100;
    return Math.min(percent, 100)
  })
  intervalId: any

  constructor() {
    this.startMockPlayback()
  }
  

  startMockPlayback() {
    this.intervalId = setInterval(() => {
      if (!this.playService.isPlaying()) return; // Pause check

      const newProgress = this.progress() + 1;
      if (newProgress <= this.duration) {
        this.progress.set(newProgress);
      } else {
        clearInterval(this.intervalId);
      }
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}
