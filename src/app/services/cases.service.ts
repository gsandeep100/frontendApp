import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { LogHttpRequest } from '../../utils/log.decorator';
import endpoints from '../constants/endpoints';
import { Cases } from '../models/case';

@Injectable({
  providedIn: 'root',
})
export class CasesService {
  constructor(private http: HttpClient) {}

  @LogHttpRequest('GET cases')
  getCases<T>() {
    return this.http.get<T>(endpoints.cases).pipe(
      catchError(this.handleError) // Handle errors here
    );
  }

  @LogHttpRequest('GET single cases')
  getCase(id: string) {
    return this.http.get(endpoints?.cases + `/${id}`).pipe(
      catchError(this.handleError) // Handle errors here
    );
  }

  @LogHttpRequest('POST case')
  createCase(data: Omit<Cases, 'id'>) {
    return this.http.post(endpoints.addCase, data).pipe(
      catchError(this.handleError) // Handle errors here
    );
  }

  @LogHttpRequest('Update case')
  updateCase(id: string, data: Cases) {
    return this.http.put(endpoints?.cases + `/${id}`, data).pipe(
      catchError(this.handleError) // Handle errors here
    );
  }

  @LogHttpRequest('DELETE case')
  deleteCase(id: string) {
    return this.http.delete(endpoints?.cases + `/${id}`).pipe(
      catchError(this.handleError) // Handle errors here
    );
  }

  // Error handling function
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    console.log(error);
    const statusCode = error?.status;
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `${error.error.message}`;
    } else {
      switch (statusCode) {
        case 0:
          errorMessage = 'Server is down. Please try again later.';
          break;
        case 400:
          errorMessage = 'Bad request. Please check your input and try again.';
          break;
        case 401:
          errorMessage = 'Unauthorized. Please login and try again.';
          break;
        case 403:
          errorMessage =
            'Forbidden. You do not have permission to access this resource.';
          break;
        case 404:
          errorMessage = 'Resource not found. Please try again.';
          break;
        case 500:
          errorMessage = 'Internal server error. Please try again later.';
          break;
        default:
          errorMessage = 'An error occurred. Please try again.';
          break;
      }
      // errorMessage = `${error.status} - ${error.statusText}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
