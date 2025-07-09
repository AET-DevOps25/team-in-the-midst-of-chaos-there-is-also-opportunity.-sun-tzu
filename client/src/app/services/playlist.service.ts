import { inject, Injectable, Signal, signal } from '@angular/core';
import { Song, Track, TrackType } from '../interfaces/track';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces';
import { SongDto } from '../dtos';
import { SongCatalogueComponent } from '../components/song-catalogue/song-catalogue.component';
import { NewPlaylistDto } from '@app/dtos/new-playlist';
import { CurrentAudio } from '@app/dtos/current-audio';
import { MetadataDto } from '@app/dtos/get-metadata';
import { NextAudiosDto } from '@app/dtos/next-audios';
import { FindSongDto } from '@app/dtos/find-song';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  apiService = inject(ApiService)
  baseUrl = '/playlist'

  newPlaylist(): Observable<ApiResponse<
    NewPlaylistDto
  >> {
    return this.apiService.post(
      this.baseUrl + '/newPlaylist'
    )
  }

  addSong(session: number | string, song: number): Observable<ApiResponse<any>> {
    return this.apiService.post(
      this.baseUrl + '/addSong',
      {session: session, song: song}
    )
  }

  getNextAudios(session: number | string): Observable<ApiResponse<NextAudiosDto>> {
    return this.apiService.get(
      this.baseUrl + '/nextAudios',
      {session: session}
    )
  }

  getMetadata(songId: number): Observable<ApiResponse<MetadataDto>> {
    return this.apiService.get(
      this.baseUrl + '/metadata',
      {id: songId}
    )
  }

  getMetadataMulti(songIds: number[]): Observable<ApiResponse<MetadataDto[]>> {
    return this.apiService.get(
      this.baseUrl + '/metadataMulti',
      {ids: songIds}
    )
  }

  findSong(prefix: string): Observable<ApiResponse<FindSongDto>> {
    return this.apiService.get(
      this.baseUrl + '/find',
      {prefix: prefix}
    )
  }

  currentAudio(session: number | string): Observable<ApiResponse<CurrentAudio>> {
    return this.apiService.get(
      this.baseUrl + '/currentAudio',
      {session: session.toString()}
    )
  }

  removeHead(session: number | string) {
    return this.apiService.delete(
      this.baseUrl + '/removeHead',
      {session: session.toString()}
    )
  }
}
