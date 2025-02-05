import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Cases } from '../../models/case';
import { CasesService } from '../../services/cases.service';
import { DataService } from '../../services/data.service';
import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;
  let mockCasesService: any;
  let mockDataService: any;

  beforeEach(async () => {
    mockCasesService = jasmine.createSpyObj('CasesService', ['deleteCase']);
    mockDataService = jasmine.createSpyObj('DataService', [
      'notifyTableToRefresh',
    ]);

    await TestBed.configureTestingModule({
      imports: [ModalComponent],
      providers: [
        { provide: CasesService, useValue: mockCasesService },
        { provide: DataService, useValue: mockDataService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the modal with the correct data for edit', () => {
    const mockCase: Cases = {
      id: '1',
      title: 'Test Case',
      caseNumber: '123',
      description: 'Description',
      status: 'Open',
    };

    component.openModal('edit', mockCase);
    expect(component.isModalOpen).toBeTrue();
    expect(component.modalTitle).toBe('Test Case');
    expect(component.modalType).toBe('edit');
    expect(component.selectedCase).toEqual(mockCase);
  });

  it('should open the modal with the correct data for delete', () => {
    const mockCase: Cases = {
      id: '1',
      title: 'Test Case',
      caseNumber: '123',
      description: 'Description',
      status: 'Open',
    };

    component.openModal('delete', mockCase);
    expect(component.isModalOpen).toBeTrue();
    expect(component.modalTitle).toBe('Delete Case');
    expect(component.modalText).toBe(
      'Are you sure you want to delete this case?'
    );
    expect(component.modalType).toBe('delete');
    expect(component.selectedCase).toEqual(mockCase);
  });

  it('should close the modal', () => {
    component.isModalOpen = true;
    component.closeModal();
    expect(component.isModalOpen).toBeFalse();
    expect(component.modalType).toBe('');
    expect(component.selectedCase).toBeNull();
  });

  it('should delete the selected case and notify the table to refresh', (done: DoneFn) => {
    const mockCase: Cases = {
      id: '1',
      title: 'Test Case',
      caseNumber: '123',
      description: 'Description',
      status: 'Open',
    };

    component.selectedCase = mockCase;
    component.modalType = 'delete';

    mockCasesService.deleteCase.and.returnValue(of({}));

    component.onDelete();

    setTimeout(() => {
      expect(component.isDeleting).toBeFalse();
      expect(mockCasesService.deleteCase).toHaveBeenCalledWith('1');
      expect(mockDataService.notifyTableToRefresh).toHaveBeenCalled();
      done();
    }, 0);
  });

  it('should handle delete error gracefully', (done: DoneFn) => {
    const mockCase: Cases = {
      id: '1',
      title: 'Test Case',
      caseNumber: '123',
      description: 'Description',
      status: 'Open',
    };

    component.selectedCase = mockCase;
    component.modalType = 'delete';

    mockCasesService.deleteCase.and.returnValue(
      throwError(() => new Error('Delete failed'))
    );

    component.onDelete();

    setTimeout(() => {
      expect(component.isDeleting).toBeFalse();
      expect(mockCasesService.deleteCase).toHaveBeenCalledWith('1');
      done();
    }, 0);
  });

  // Test to ensure projected components render correctly
  it('should render the correct component based on modal type', () => {
    component.openModal('view', {
      id: '6',
      title: 'View Test',
      caseNumber: '999',
      description: 'A case to view',
      status: 'Closed',
    });

    fixture.detectChanges(); // Ensure the template updates

    const viewComponent = fixture.nativeElement.querySelector('app-view-case');

    expect(viewComponent).toBeTruthy();
  });
});
