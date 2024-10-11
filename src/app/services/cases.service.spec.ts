import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Cases } from '../models/case';
import { CasesService } from './cases.service';

describe('CasesService', () => {
  let service: CasesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CasesService],
    });

    service = TestBed.inject(CasesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure that there are no pending requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get cases from the API', () => {
    const mockCases: Cases[] = [
      {
        id: '1',
        title: 'Test Case',
        caseNumber: '123',
        description: 'Test description',
        status: 'Open',
      },
    ];

    service.getCases<Cases[]>().subscribe((cases) => {
      expect(cases.length).toBe(1);
      expect(cases).toEqual(mockCases);
    });

    const req = httpMock.expectOne('/cases');
    expect(req.request.method).toBe('GET');
    req.flush(mockCases); // Simulate the response
  });

  it('should create a case via the API', () => {
    const mockCase: Omit<Cases, 'id'> = {
      title: 'New Case',
      caseNumber: '456',
      description: 'New description',
      status: 'Open',
    };

    service.createCase(mockCase).subscribe((response) => {
      expect(response).toEqual(mockCase);
    });

    const req = httpMock.expectOne('/cases/addNewCase');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockCase);
    req.flush(mockCase); // Simulate the response
  });

  it('should handle error from the API', () => {
    const mockError = { status: 500, statusText: 'Internal Server Error' };

    service.getCases<Cases[]>().subscribe(
      () => {},
      (error) => {
        // console.log(error?.message);
        expect(error?.message).toContain(
          'Internal server error. Please try again later.'
        );
      }
    );

    const req = httpMock.expectOne('/cases');
    req.flush('Error message', mockError); // Simulate an error response
  });
});
