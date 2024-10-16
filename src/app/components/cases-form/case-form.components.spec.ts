import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { CasesService } from '../../services/cases.service';
import { DataService } from '../../services/data.service';
import { ManageCaseService } from '../../services/manage-case.service';
import { CasesFormComponent } from './cases-form.component';

describe('CasesFormComponent', () => {
  let component: CasesFormComponent;
  let fixture: ComponentFixture<CasesFormComponent>;
  let caseServiceMock: jasmine.SpyObj<CasesService>;
  let manageCaseServiceMock: jasmine.SpyObj<ManageCaseService>;
  let dataServiceMock: jasmine.SpyObj<DataService>;
  let dataSubject: Subject<any>;

  beforeEach(async () => {
    caseServiceMock = jasmine.createSpyObj('CasesService', [
      'createCase',
      'updateCase',
    ]);
    manageCaseServiceMock = jasmine.createSpyObj('ManageCaseService', [], {
      data$: new Subject<any>(),
    });
    dataServiceMock = jasmine.createSpyObj('DataService', [
      'notifyTableToRefresh',
      'notifyTabChange',
    ]);

    dataSubject = manageCaseServiceMock.data$ as Subject<any>;

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        CasesFormComponent,
      ],
      providers: [
        { provide: CasesService, useValue: caseServiceMock },
        { provide: ManageCaseService, useValue: manageCaseServiceMock },
        { provide: DataService, useValue: dataServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CasesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should set form values when data is received from the service', () => {
    const mockCase = {
      id: '1',
      title: 'Loaded Case',
      caseNumber: '456',
      description: 'This is a loaded case',
      status: 'Closed',
    };

    dataSubject.next(mockCase);
    fixture.detectChanges();

    expect(component.caseForm.get('title')?.value).toBe('Loaded Case');
    expect(component.caseForm.get('caseNumber')?.value).toBe('456');
    expect(component.caseForm.get('description')?.value).toBe(
      'This is a loaded case'
    );
    expect(component.caseForm.get('status')?.value).toBe('Closed');
  });
});
