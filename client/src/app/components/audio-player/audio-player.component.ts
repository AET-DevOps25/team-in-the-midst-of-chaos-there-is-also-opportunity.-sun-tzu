import { Component, computed, effect, ElementRef, EventEmitter, inject, Input, NgZone, Output, Signal, ViewChild } from '@angular/core';
import { PlayService } from '../../services';


/**
 * Wraps a native DOM audio element.
 */
@Component({
  selector: 'app-audio-player',
  imports: [],
  templateUrl: './audio-player.component.html',
  styleUrl: './audio-player.component.scss'
})
export class AudioPlayerComponent {
  playService = inject(PlayService)
  zone = inject(NgZone)

  @ViewChild('audio', { static: true })
  private readonly audioRef!: ElementRef<HTMLAudioElement>;

  // service → DOM
  streamUrl: Signal<string> = computed(() => this.playService.streamUrl() ?? "")
  readonly mirrorPlayService = effect(() => {
    const el = this.audioRef.nativeElement
    this.playService.isPlaying() ? el.play() : el.pause();
  })


  ngAfterViewInit(): void {
    /* DOM → service (progress) */
    const s = this.playService
    const el = this.audioRef.nativeElement
    this.zone.runOutsideAngular(() => {
      el.addEventListener('timeupdate', () => s.currentTime.set(el.currentTime));
      el.addEventListener('durationchange', () => s.duration.set(el.duration));
      el.addEventListener('ended', () => s.trackFinished());
      el.addEventListener('canplay', () => s.canPlay.set(true));
    });
  }

}
