import { Component, computed, effect, ElementRef, EventEmitter, inject, Input, NgZone, OnInit, Output, Signal, ViewChild } from '@angular/core';
import { PlayService } from '../../services';
import { PlaylistService } from '@app/services/playlist.service';
import { delay, of, switchMap } from 'rxjs';


/**
 * Wraps a native DOM audio element.
 */
@Component({
  selector: 'app-background-player',
  imports: [],
  templateUrl: './background-player.component.html',
  styleUrl: './background-player.component.scss'
})
export class BackgroundPlayerComponent implements OnInit {
  playService = inject(PlayService)
  playlistService = inject(PlaylistService)
  zone = inject(NgZone)

  @ViewChild('audio', { static: true })
  private readonly audioRef!: ElementRef<HTMLAudioElement>;

  // service → DOM
  readonly mirrorPlayService = effect(() => {
    const el = this.audioRef.nativeElement
    const url = this.playService.streamUrl()

    // clear src
    if (url == null) {
      el.removeAttribute('src')
      el.load()
      return
    }

    // set src
    if (el.getAttribute('src') !== url) {
      el.setAttribute('src', url)
      el.load()
    }

    // set playing status
    this.playService.isPlaying() ? el.play() : el.pause()
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

  ngOnInit(): void {
    const sub = of(undefined).pipe(delay(2000), switchMap(() => this.playService.syncAudioId())).subscribe()
  }

}
