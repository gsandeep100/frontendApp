import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  // Subject for broadcasting table refresh
  private refreshTableSubject = new Subject<void>();
  private tabChangeSubject = new Subject<void>();

  // Method to notify components to refresh the table
  notifyTableToRefresh(): void {
    this.refreshTableSubject.next();
  }

  // Method for table component to subscribe to refresh event
  getRefreshTableObservable(): Observable<void> {
    return this.refreshTableSubject.asObservable();
  }

  // Method to notify components to refresh the table
  notifyTabChange(): void {
    this.tabChangeSubject.next();
  }

  // Method for table component to subscribe to refresh event
  getTabChangeObservable(): Observable<void> {
    return this.tabChangeSubject.asObservable();
  }
}
