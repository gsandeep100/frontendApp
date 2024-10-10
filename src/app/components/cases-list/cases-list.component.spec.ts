import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { CasesService } from '../../services/cases.service';
import { DataService } from '../../services/data.service';
import { ManageCaseService } from '../../services/manage-case.service';
import { CasesFormComponent } from '../cases-form/cases-form.component';
import { ModalComponent } from '../modal/modal.component';
import { CasesListComponent } from './cases-list.component';

describe('CasesListComponent', () => {
  let component: CasesListComponent;
  let fixture: ComponentFixture<CasesListComponent>;
  let casesService: jasmine.SpyObj<CasesService>;
  let dataService: jasmine.SpyObj<ManageCaseService>;
  let loadingService: jasmine.SpyObj<DataService>;
  let modalComponent: jasmine.SpyObj<ModalComponent>;

  const mockCases = [
    {
      id: '1',
      title: 'Case 1',
      caseNumber: '001',
      description: 'Description 1',
      status: 'Open',
    },
    {
      id: '2',
      title: 'Case 2',
      caseNumber: '002',
      description: 'Description 2',
      status: 'Closed',
    },
  ];

  beforeEach(async () => {
    const casesServiceSpy = jasmine.createSpyObj('CasesService', ['getCases']);
    const dataServiceSpy = jasmine.createSpyObj('ManageCaseService', [
      'setData',
    ]);
    const loadingServiceSpy = jasmine.createSpyObj('DataService', [
      'getRefreshTableObservable',
    ]);

    loadingServiceSpy.getRefreshTableObservable.and.returnValue(of(null));

    modalComponent = jasmine.createSpyObj('ModalComponent', [
      'openModal',
      'closeModal',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        CasesFormComponent,
        CasesListComponent,
        ModalComponent,
      ],
      providers: [
        { provide: CasesService, useValue: casesServiceSpy },
        { provide: ManageCaseService, useValue: dataServiceSpy },
        { provide: DataService, useValue: loadingServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CasesListComponent);
    component = fixture.componentInstance;

    component.modalComponent = modalComponent;

    casesService = TestBed.inject(CasesService) as jasmine.SpyObj<CasesService>;
    dataService = TestBed.inject(
      ManageCaseService
    ) as jasmine.SpyObj<ManageCaseService>;
    loadingService = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load cases on init', () => {
    casesService.getCases.and.returnValue(of(mockCases));
    component.loading = true;

    component.loadCases();

    expect(component.loading).toBe(false);
    expect(component.caseList).toEqual(mockCases);
    expect(casesService.getCases).toHaveBeenCalled();
  });

  it('should handle error when loading cases', () => {
    const errorMessage = 'Error loading cases';
    casesService.getCases.and.returnValue(
      throwError(() => new Error(errorMessage))
    );

    component.loading = true;

    component.ngOnInit();
    expect(casesService.getCases).toHaveBeenCalled();
    expect(component.error).toBe(errorMessage);
    expect(component.loading).toBeFalse();
  });

  it('should open modal with edit type', () => {
    const mockCase = mockCases[0];

    component.openChildModal('edit', mockCase);

    expect(dataService.setData).toHaveBeenCalledWith(mockCase);
    expect(modalComponent.openModal).toHaveBeenCalledWith('edit', mockCase);
    expect(component.isEdit).toBeTrue();
  });

  it('should close the modal', () => {
    component.closeChildModal();

    expect(modalComponent.closeModal).toHaveBeenCalled();
    expect(component.isEdit).toBeFalse();
  });

  it('should open modal with delete type', () => {
    const mockCase = mockCases[0];

    component.openChildModal('delete', mockCase);

    expect(dataService.setData).toHaveBeenCalledWith(mockCase);
    expect(modalComponent.openModal).toHaveBeenCalledWith('delete', mockCase);
    expect(component.isEdit).toBeFalse();
  });

  it('should open modal with edit type', () => {
    const mockCase = mockCases[0];

    component.openChildModal('edit', mockCase);

    expect(dataService.setData).toHaveBeenCalledWith(mockCase);
    expect(modalComponent.openModal).toHaveBeenCalledWith('edit', mockCase);
    expect(component.isEdit).toBeTrue();
  });
});
