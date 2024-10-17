import { TestBed } from '@angular/core/testing';
import { first } from 'rxjs/operators';
import { Cases } from '../models/case';
import { ManageCaseService } from './manage-case.service';

describe('ManageCaseService', () => {
  let service: ManageCaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageCaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get case data', () => {
    const mockCase: Cases = {
      id: '1',
      title: 'Test Case',
      caseNumber: '123',
      description: 'Test description',
      status: 'Open',
    };

    service.setData(mockCase);
    expect(service.getData()).toEqual(mockCase);
  });

  it('should emit case data as an observable', (done: DoneFn) => {
    const mockCase: Cases = {
      id: '1',
      title: 'Test Case',
      caseNumber: '123',
      description: 'Test description',
      status: 'Open',
    };

    // Emit the mock case data first
    service.setData(mockCase);

    // Subscribe to the observable and use first() to only take the first emitted value
    service.data$.pipe(first()).subscribe((data) => {
      expect(data).toEqual(mockCase);
      done();
    });
  });
});
