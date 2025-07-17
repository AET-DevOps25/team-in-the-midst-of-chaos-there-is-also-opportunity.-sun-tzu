import { Component, OnDestroy, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayService } from '@app/services/play.service';

interface Bar {
  height: number;
}

@Component({
  selector: 'app-equalizer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './equalizer.component.html',
  styleUrls: ['./equalizer.component.scss'],
})
export class EqualizerComponent implements OnDestroy {
  private playService = inject(PlayService);

  // signal holding current bar heights
  bars = signal<Bar[]>(this.createBars());

  // signal reflecting play/pause state
  isPlaying = signal<boolean>(false);

  // we'll fire an interval to regenerate bars every 150ms
  private intervalId = window.setInterval(() => {
    if (this.playService.isPlaying()) {
      this.bars.set(this.createBars());
    }
  }, 150);

  constructor() {
    // keep our local isPlaying in sync with the service
    effect(() => {
      this.isPlaying.set(this.playService.isPlaying());
    });
  }

  private createBars(count = 20): Bar[] {
    return Array.from({ length: count }, () => ({
      height: Math.random() * 80 + 20  // 20%–100% of container
    }));
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}
