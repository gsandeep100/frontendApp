import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { of } from 'rxjs';
import { DataService } from '../../services/data.service';
import { CasesFormComponent } from '../cases-form/cases-form.component';
import { CasesListComponent } from '../cases-list/cases-list.component';
import { ModalComponent } from '../modal/modal.component';
import { CasesTabComponent } from './cases-tab.component';

describe('CasesTabComponent', () => {
  let component: CasesTabComponent;
  let fixture: ComponentFixture<CasesTabComponent>;
  let dataService: jasmine.SpyObj<DataService>;

  beforeEach(async () => {
    // Mock the DataService
    dataService = jasmine.createSpyObj('DataService', {
      getRefreshTableObservable: of(null), // Ensure it returns an observable
    });

    await TestBed.configureTestingModule({
      imports: [
        CasesFormComponent,
        CasesListComponent,
        ModalComponent,
        CasesTabComponent,
        HttpClientTestingModule,
      ], // Import child components
      providers: [{ provide: DataService, useValue: dataService }], // Provide the mock DataService
    }).compileComponents();

    fixture = TestBed.createComponent(CasesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger initial change detection
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set active tab correctly', () => {
    component.setActiveTab('List Case');
    expect(component.activeTab).toBe('List Case');

    component.setActiveTab('Create Case');
    expect(component.activeTab).toBe('Create Case');
  });

  it('should subscribe to the refresh table observable and change active tab to "List Case"', fakeAsync(() => {
    const mockObservable = of(null); // Mock observable
    dataService.getRefreshTableObservable.and.returnValue(
      mockObservable as any
    );

    fixture.detectChanges(); // Initialize the component and set up the subscription
    tick(); // Simulate async observable emitting

    expect(component.activeTab).toBe('List Case');
  }));

  it('should have tabs for "Create Case" and "List Case"', () => {
    expect(component.tabs).toEqual(['Create Case', 'List Case']);
  });
});
