import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { ApiResponse, ErrorDto, ErrorType, HttpRequestMethod } from '../interfaces';

interface IHttpParams {
  [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
}

/**
 * This class should be used to make calls to the backend API.
 * The main advantage over using HttpClient directly is that the response is wrapped in an `ApiResponse` object,
 * which allows for typed error checking.
 */
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl: string;
  public serviceName: string;
  private readonly http = inject(HttpClient)

  constructor() {
    this.baseUrl = '/api';
    this.serviceName = 'API Service';
  }

  /**
   * `S` is the type of the data returned upon success, while an error of type `E` is returned on failure.
   * @param method HTTP method to use
   * @param route relative to API base url; must start with "/"
   * @param body body content
   * @param params URL-encoded parameters
   * @returns
   */
  private request<S, E extends ErrorType>(method: HttpRequestMethod, route: string, params?: IHttpParams, body?: any): Observable<ApiResponse<S, E>> {
    // define options
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: body,
      params: new HttpParams({ fromObject: params }),
    };

    // make the request
    return this.http.request<S>(method, this.baseUrl + route, httpOptions).pipe(
      map((response) => {
        // success
        return {
          success: true,
          data: response,
        } as const;
      }),
      catchError((e) => {
        if (!(e instanceof HttpErrorResponse)) {
          // unexpected error
          return throwError(() => e);
        }
        // expected backend error; extract error message
        const response = e.error as ErrorDto<E>;
        return of({
          success: false,
          error: response.message,
        } as const);
      }),
    );
  }

  get<S, E extends ErrorType>(route: string, params?: IHttpParams) {
    return this.request<S, E>('GET', route, params, undefined);
  }

  delete<S, E extends ErrorType>(route: string, params?: IHttpParams) {
    return this.request<S, E>('DELETE', route, params, undefined);
  }

  put<S, E extends ErrorType>(route: string, params?: IHttpParams, data?: unknown) {
    return this.request<S, E>('PUT', route, params, data);
  }

  post<S, E extends ErrorType>(route: string, params?: IHttpParams, data?: unknown) {
    return this.request<S, E>('POST', route, params, data);
  }

  patch<S, E extends ErrorType>(route: string, params?: IHttpParams, data?: unknown) {
    return this.request<S, E>('PATCH', route, params, data);
  }
}

/**
  ---- EXAMPLE ----

  // define route
  getFoo(): Observable<ApiResponse<
    UserSelfViewDto,
    NotFoundType.PrinterFile | NotFoundType.User | ConflictType.TaskAlreadyScheduled
  >> {
    return this.api.get('/api/ahdsfjl')
  }

  // Option 1: handle all errors in switch case
  this.getFoo().subscribe({
    next: r => {
      if (r.success) {
        r.data
      } else {
        switch (r.error) {
          case NotFoundType.User:
            break
          case NotFoundType.PrinterFile:
            break
          case ConflictType.TaskAlreadyScheduled:
            break
          default:
            r.error satisfies never
        }
      }
    },
    error: x => console.log(x)
  })

  // Option 2: check for more general error types
  this.getFoo().subscribe({
    next: r => {
      if (r.success) {
        r.data
      } else if (isNotFoundError(r.error)) {
        r.error
      } else if (isConflictError(r.error)) {
        r.error
      } else {
        r.error satisfies never
      }
    },
    error: x => console.log(x)
  })

 */
