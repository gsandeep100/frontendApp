import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cases } from '../app/components/cases-list/cases-list.component';

@Injectable({
  providedIn: 'root',
})
export class ManageCaseService {
  private dataSubject = new BehaviorSubject<Cases | null>(null);
  public data$: Observable<Cases | null> = this.dataSubject.asObservable();

  setData(data: Cases): void {
    this.dataSubject.next(data);
  }

  getData(): Cases | null {
    return this.dataSubject.getValue();
  }
}
