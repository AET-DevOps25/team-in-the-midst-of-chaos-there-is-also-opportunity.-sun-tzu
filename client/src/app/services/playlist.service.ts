import { inject, Injectable } from '@angular/core';
import { Song } from '../interfaces/track';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces';
import { SongDto } from '../dtos';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  apiService = inject(ApiService)

  availableSongs: Song[] = [
    {
      title: "Bohemian Rhapsody",
      artist: "Queen",
      year: "1975"
    },
    {
      title: "Billie Jean",
      artist: "Michael Jackson",
      year: "1982"
    },
    {
      title: "Smells Like Teen Spirit",
      artist: "Nirvana",
      year: "1991"
    },
    {
      title: "Hey Ya!",
      artist: "OutKast",
      year: "2003"
    },
    {
      title: "Rolling in the Deep",
      artist: "Adele",
      year: "2010"
    }
  ]

  queue: Song[] = [
    this.availableSongs[0]
  ]

  constructor() { }

  getAvailableSongs(): Observable<ApiResponse<
    SongDto[],
    never
  >> {
    return this.apiService.get('availableSongs')
  }
}
