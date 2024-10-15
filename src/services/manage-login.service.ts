import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {Login} from '../models/login';

@Injectable({
  providedIn: 'root',
})
export class ManageLoginService {
  private dataSubject = new BehaviorSubject<Login | null>(null);
  public data$: Observable<Login | null> = this.dataSubject.asObservable();

  setData(data: Login): void {
    this.dataSubject.next(data);
  }

  getData(): Login | null {
    return this.dataSubject.getValue();
  }
}
