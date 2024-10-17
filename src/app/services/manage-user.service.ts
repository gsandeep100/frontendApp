import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Login } from '../models/login';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class ManageUserService {
  private dataSubject = new BehaviorSubject<Login | null>(null);
  public data$: Observable<User | null> = this.dataSubject.asObservable();

  setData(data: User): void {
    this.dataSubject.next(data);
  }

  getData(): User | null {
    return this.dataSubject.getValue();
  }
}
