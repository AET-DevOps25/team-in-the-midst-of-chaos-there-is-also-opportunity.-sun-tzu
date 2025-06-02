import { Component, computed, Signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { PlayService } from '../play.service';
import { inject } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-play-button',
  imports: [MatIconModule, MatButtonModule],
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
    this.playService.isPlaying.update(value => !value)
    this.apiService.dummyRoute().subscribe(
      data => this.currentMessage = data
    )
  }

}
