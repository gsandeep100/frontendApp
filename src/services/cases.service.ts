import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Cases } from '../app/components/cases-list/cases-list.component';
import { Case } from '../models/case';

@Injectable({
  providedIn: 'root',
})
export class CasesService {
  constructor(private http: HttpClient) {}

  getCases<T>() {
    return this.http.get<T>('/cases').pipe(
      catchError(this.handleError) // Handle errors here
    );
  }

  getCase(id: string) {
    return this.http.get(`/cases/${id}`).pipe(
      catchError(this.handleError) // Handle errors here
    );
  }

  createCase(data: Case) {
    return this.http.post('/cases/addNewCase', data).pipe(
      catchError(this.handleError) // Handle errors here
    );
  }

  updateCase(id: string, data: Cases) {
    return this.http.put(`/cases/${id}`, data).pipe(
      catchError(this.handleError) // Handle errors here
    );
  }

  deleteCase(id: string) {
    return this.http.delete(`/cases/${id}`).pipe(
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
