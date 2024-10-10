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
    dataService = jasmine.createSpyObj('DataService', {
      getRefreshTableObservable: of(null),
    });

    await TestBed.configureTestingModule({
      imports: [
        CasesFormComponent,
        CasesListComponent,
        ModalComponent,
        CasesTabComponent,
        HttpClientTestingModule,
      ],
      providers: [{ provide: DataService, useValue: dataService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CasesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
    const mockObservable = of(null);
    dataService.getRefreshTableObservable.and.returnValue(
      mockObservable as any
    );

    fixture.detectChanges();
    tick();

    expect(component.activeTab).toBe('List Case');
  }));

  it('should have tabs for "Create Case" and "List Case"', () => {
    expect(component.tabs).toEqual(['Create Case', 'List Case']);
  });
});
