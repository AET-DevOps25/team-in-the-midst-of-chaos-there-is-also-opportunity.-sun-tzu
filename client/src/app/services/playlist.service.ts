import { inject, Injectable } from '@angular/core';
import { Song, Track, TrackType } from '../interfaces/track';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces';
import { SongDto } from '../dtos';
import { SongCatalogueComponent } from '../components/song-catalogue/song-catalogue.component';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  apiService = inject(ApiService)

  availableSongs: Song[] = [
    {
      id: 1,
      type: TrackType.Song,
      title: "Bohemian Rhapsody",
      artist: "Queen",
      year: "1975"
    },
    {
      id: 1,
      type: TrackType.Song,
      title: "Billie Jean",
      artist: "Michael Jackson",
      year: "1982"
    },
    {
      id: 1,
      type: TrackType.Song,
      title: "Smells Like Teen Spirit",
      artist: "Nirvana",
      year: "1991"
    },
    {
      id: 1,
      type: TrackType.Song,
      title: "Hey Ya!",
      artist: "OutKast",
      year: "2003"
    },
    {
      id: 1,
      type: TrackType.Song,
      title: "Rolling in the Deep",
      artist: "Adele",
      year: "2010"
    }
  ]

  queue: Song[] = [
    this.availableSongs[0]
  ]

  constructor() {
    this.createPlaylist().subscribe(x => {
      x
    })
  }

  getAvailableSongs(): Observable<ApiResponse<
    SongDto[]
  >> {
    return this.apiService.get('availableSongs')
  }

  createPlaylist(): Observable<ApiResponse<
    any
  >> {
    return this.apiService.get('newPlaylist')
  }

  getTrack(id: number): Track {
    return this.availableSongs[0]
  }
}
