import { Component, computed, Signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { PlayService } from '../../services/play.service';
import { inject } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AudioPlayerComponent } from '../audio-player/audio-player.component';

@Component({
  selector: 'app-play-button',
  imports: [MatIconModule, MatButtonModule, AudioPlayerComponent],
  templateUrl: './play-button.component.html',
  styleUrl: './play-button.component.scss'
})
export class PlayButtonComponent {
  playService = inject(PlayService)
  apiService = inject(ApiService)
  currentMessage: string = ""

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
