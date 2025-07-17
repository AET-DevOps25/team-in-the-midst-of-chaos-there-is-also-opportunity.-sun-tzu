import { Component, OnDestroy, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayService } from '@app/services/play.service';

interface Bar {
  height: number;
  color: string;
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

  private palette = [
    'rgba(79,70,229,0.6)',
    'rgba(108,40,217,0.6)',
    'rgba(168,85,247,0.6)',
    'rgba(236,72,153,0.6)',
    'rgba(244,114,182,0.6)',
  ];

  // Snappier when active, very slow when resting
  private smoothingActive = 0.1;
  private smoothingRest   = 0.01;
  private intervalActive  = 150;
  private intervalRest    = 2000;

  // Our bar heights
  bars = signal<Bar[]>(this.createRestBars());

  // True only when playing *and* currentMetadata.type === 'song'
  isActive = computed(() => {
    const playing = this.playService.isPlaying();
    const meta    = this.playService.currentMetadata();
    return playing && meta?.type === 'song';
  });

  // Internals for our requestAnimationFrame loop
  private targetBars = this.createRestBars();
  private lastTime   = 0;
  private destroyed  = false;

  constructor() {
    // Kick off our animation loop
    requestAnimationFrame(this.tick.bind(this));
  }

  private tick(now: number) {
    if (this.destroyed) return;

    // Initialize
    if (!this.lastTime) this.lastTime = now;

    // Choose dynamic regen & smoothing based on active vs rest
    const active = this.isActive();
    const regen   = active ? this.intervalActive : this.intervalRest;
    const smooth  = active ? this.smoothingActive : this.smoothingRest;

    // Time to pick new targets?
    if (now - this.lastTime >= regen) {
      this.targetBars = active
          ? this.createBars()
          : this.createRestBars();
      this.lastTime = now;
    }

    // Low‑pass filter toward targetBars
    this.bars.update(old =>
        old.map((bar, i) => ({
          ...bar,
          height: bar.height * (1 - smooth) + this.targetBars[i].height * smooth
        }))
    );

    // Next frame
    requestAnimationFrame(this.tick.bind(this));
  }

  private createBars(count = 20): Bar[] {
    return Array.from({ length: count }, (_, i) => ({
      height: Math.random() * 80 + 20,
      color: this.palette[i % this.palette.length]
    }));
  }

  private createRestBars(count = 20): Bar[] {
    return Array.from({ length: count }, (_, i) => ({
      height: Math.random() * 20 + 40,
      color: this.palette[i % this.palette.length]
    }));
  }

  ngOnDestroy() {
    this.destroyed = true;
  }
}
