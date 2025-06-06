import { inject, Injectable } from '@angular/core';
import { signal } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class PlayService {
  api = inject(ApiService)
  isPlaying = signal(false);

  
  greet(): Observable<ApiResponse<
    string,
    any
  >> {
    return this.api.get('/stream/greet')
  }

}
