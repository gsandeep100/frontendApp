import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { Cases } from '../../models/case';
import { ManageCaseService } from '../../services/manage-case.service';
import { ViewCaseComponent } from './view-case.component';

describe('ViewCaseComponent', () => {
  let component: ViewCaseComponent;
  let fixture: ComponentFixture<ViewCaseComponent>;
  let mockManageCaseService: jasmine.SpyObj<ManageCaseService>;

  const mockCase: Cases = {
    id: '1',
    caseNumber: '123',
    title: 'Test Case',
    description: 'This is a test description.',
    status: 'Open',
  };

  beforeEach(async () => {
    mockManageCaseService = jasmine.createSpyObj('ManageCaseService', [
      'data$',
    ]);
    mockManageCaseService.data$ = of(mockCase);

    await TestBed.configureTestingModule({
      imports: [ViewCaseComponent], // Import the standalone component here
      providers: [
        { provide: ManageCaseService, useValue: mockManageCaseService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger change detection
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display case details correctly', () => {
    fixture.detectChanges(); // Ensure changes are applied

    const caseNumber = fixture.debugElement.query(By.css('h2')).nativeElement;
    const title = fixture.debugElement.query(By.css('.p1')).nativeElement;
    const status = fixture.debugElement.query(By.css('.p2')).nativeElement;
    const description = fixture.debugElement.query(
      By.css('.w-full p')
    ).nativeElement;

    expect(caseNumber.textContent).toContain('123');
    expect(title.textContent).toContain('Test Case');
    expect(status.textContent).toContain('Open');
    expect(description.textContent).toContain('This is a test description.');
  });
});
