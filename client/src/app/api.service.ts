import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://localhost:8080/api';
  private http = inject(HttpClient)

  dummyRoute(): Observable<string> {
    return of('hi')
    return this.http.get(this.baseUrl + "/greet", {responseType: 'text'})
  }
}
