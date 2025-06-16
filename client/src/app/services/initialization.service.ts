import { Injectable, signal } from '@angular/core';
import { delay, Observable, of, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class InitializationService {
  isInitialized = signal(false)

  initialize(): Observable<void> {
    return of(undefined).pipe(
      delay(3000),
      tap(() => this.isInitialized.set(true))
    )
  }

}
