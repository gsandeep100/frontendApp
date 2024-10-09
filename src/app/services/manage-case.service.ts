import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cases } from '../models/case';

@Injectable({
  providedIn: 'root',
})
export class ManageCaseService {
  private caseData: Cases | null = null; // Initially null
  private caseDataSubject = new BehaviorSubject<Cases | null>(this.caseData);
  data$ = this.caseDataSubject.asObservable();

  setData(caseData: Cases) {
    this.caseData = caseData;
    this.caseDataSubject.next(caseData); // Emit the new case data
  }

  getData(): Cases | null {
    return this.caseData;
  }
}
