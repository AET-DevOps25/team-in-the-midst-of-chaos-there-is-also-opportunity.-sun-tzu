import { Injectable, signal, Signal } from '@angular/core';
import { delay, Observable, of, ReplaySubject, tap } from 'rxjs';


export const TOKEN_NAME = 'sessionToken';

type Token = string | null;


@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly _isInitialized = signal(false)
  public readonly isInitialized = this._isInitialized.asReadonly()

  private readonly _hasSession = signal(false)
  public readonly hasSession = this._hasSession.asReadonly()

  createSession(): Observable<void> {
    return of(undefined).pipe(
      delay(2000),
      tap(() => {
        this.sessionToken = 'dummy_token'
        this._hasSession.set(true)
      })
    )
  }

  /**
   * Tries to log back in with existing token. 
   */
  restoreSession(): Observable<void> {
    if (this.sessionToken == null) {
      // not logged in
      this._hasSession.set(false)
      return of(undefined)
    }
    // token is set
    // TODO: check if token is valid
    return of(undefined).pipe(
      delay(20),
      tap(() => {
        this._hasSession.set(true)
      })
    )
  }

  destroySession(): Observable<void> {
    return of(undefined).pipe(
      delay(500),
      tap(() => {
        this.sessionToken = null
        this._hasSession.set(false)
      })
    )
  }


  // **** local storage methods ****

  get sessionToken(): Token {
    return localStorage.getItem(TOKEN_NAME);
  }

  set sessionToken(token: Token) {
    if (token === null) localStorage.removeItem(TOKEN_NAME);
    else localStorage.setItem(TOKEN_NAME, token);
  }

}
