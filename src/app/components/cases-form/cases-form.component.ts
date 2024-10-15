import {CommonModule} from '@angular/common';
import {Component, Input, OnDestroy} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {Case} from '../../../models/case';
import {CasesService} from '../../../services/cases.service';
import {DataService} from '../../../services/data.service';
import {ManageCaseService} from '../../../services/manage-case.service';
import {Cases} from '../cases-list/cases-list.component';

@Component({
  selector: 'app-cases-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Import necessary modules
  templateUrl: './cases-form.component.html',
})
export class CasesFormComponent implements OnDestroy {
  @Input() modalType: string = ''; // Dynamic title
  caseForm: FormGroup; // Declare FormGroup
  selectedCase: Cases | null = null;
  caseInitialValue: Case = new Case();
  error = '';
  loading: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private caseService: CasesService,
    private dataService: ManageCaseService,
    private notifyService: DataService
  ) {
    // Initialize FormGroup in the constructor
    this.caseForm = this.fb.group({
      title: ['', Validators.required],
      caseNumber: ['', Validators.required],
      description: ['', Validators.required],
      status: ['Open', Validators.required],
    });
    this.dataService.data$.subscribe((value) => {
      if (!value) return;
      this.caseForm.patchValue({
        title: value.title,
        caseNumber: value.caseNumber,
        description: value.description,
        status: value.status,
      });
      this.selectedCase = value;
      // console.log('Received data:', value);
    });
  }

  ngOnInit() {
    // Set initial values if the modal type is 'edit'
    this.error = '';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    if (this.caseForm.valid) {
      this.loading = true;
      this.caseInitialValue = this.caseForm.getRawValue();
      if (this?.selectedCase?.id) {
        this.caseService
          .updateCase(this.selectedCase.id, {
            ...(this.caseInitialValue as Cases),
            id: this.selectedCase?.id as string,
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (data) => {
              // console.log('Updated case:', data);
              this.loading = false;
              this.notifyService.notifyTableToRefresh();
            },
            error: (error) => {
              console.log('There was an error!', error);
              this.loading = false;
              this.error = typeof error === 'string' ? error : error.message;
            },
          });
      } else {
        this.caseService
          .createCase(this.caseInitialValue)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (data) => {
              // console.log('Created case:', data);
              this.loading = false;
              this.notifyService.notifyTableToRefresh();
            },
            error: (error) => {
              console.log('There was an error!', error);
              this.loading = false;
              this.error = typeof error === 'string' ? error : error.message;
            },
          });
      }
      this.loading = false;
      console.log(this.caseInitialValue);
      // Handle form submission here
    } else {
      console.log('Form is invalid');
      this.caseForm.markAllAsTouched();
    }
  }
}
