import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Login } from '../models/login';
import endpoints from '../constants/endpoints';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private http: HttpClient) {}

  getById<T>(id: string) {
    return this.http.get<T>(endpoints?.cases + `/${id}`).pipe(
      catchError(this.handleError) // Handle errors here
    );
  }

  getByCaseNumber<T>(casenumber: string) {
    return this.http.get<T>(endpoints?.cases + `/${casenumber}`).pipe(
      catchError(this.handleError) // Handle errors here
    );
  }

  getByCaseDescription<T>(description: string) {
    return this.http.get<T>(endpoints?.cases + `/${description}`).pipe(
      catchError(this.handleError) // Handle errors here
    );
  }

  // Error handling function
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Backend error
      errorMessage = `Server-side error: ${error.status} - ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
