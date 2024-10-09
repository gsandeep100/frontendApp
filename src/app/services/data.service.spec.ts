import { TestBed } from '@angular/core/testing';
import { DataService } from './data.service';

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should notify components to refresh the table', (done: DoneFn) => {
    service.getRefreshTableObservable().subscribe(() => {
      expect(true).toBe(true); // Just verifying that the subscription works
      done();
    });

    service.notifyTableToRefresh();
  });

  it('should notify components of tab change', (done: DoneFn) => {
    service.getTabChangeObservable().subscribe(() => {
      expect(true).toBe(true); // Just verifying that the subscription works
      done();
    });

    service.notifyTabChange();
  });
});
