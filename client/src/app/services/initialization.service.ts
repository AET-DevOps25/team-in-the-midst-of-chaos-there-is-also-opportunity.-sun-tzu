import { Injectable } from '@angular/core';
import { delay, Observable, of, tap, timeInterval, timeout } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class InitializationService {
  isInitialized: boolean = false

  initialize(): Observable<void> {
    return of(undefined).pipe(
      delay(5000),
      tap(() => this.isInitialized = true)
    )
  }

}
