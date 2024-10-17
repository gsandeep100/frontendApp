import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Log } from '../../../utils/log.decorator';
import { Cases } from '../../models/case';
import { CasesService } from '../../services/cases.service';
import { DataService } from '../../services/data.service';
import { ManageCaseService } from '../../services/manage-case.service';

@Component({
  selector: 'app-cases-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cases-form.component.html',
})
export class CasesFormComponent implements OnDestroy {
  @Input() modalType: string = '';
  caseForm: FormGroup;
  selectedCase: Cases | null = null;
  caseInitialValue: Cases | null = null;
  error = '';
  loading: boolean = false;
  private destroyForm$: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private caseService: CasesService,
    private dataService: ManageCaseService,
    private notifyService: DataService
  ) {
    this.caseForm = this.fb.group({
      title: ['', Validators.required],
      caseNumber: ['', Validators.required],
      description: ['', Validators.required],
      status: ['Open', Validators.required],
    });
  }

  ngOnInit() {
    this.error = '';
    this.dataService.data$.subscribe((value) => {
      if (!value) return;
      this.caseForm.patchValue({
        title: value.title,
        caseNumber: value.caseNumber,
        description: value.description,
        status: value.status,
      });
      this.selectedCase = value;
    });
  }

  ngOnDestroy(): void {
    this.destroyForm$.next();
    this.destroyForm$.complete();
  }

  @Log()
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
          .pipe(takeUntil(this.destroyForm$))
          .subscribe({
            next: (data) => {
              this.loading = false;
              this.dataService.setData(null);
              this.notifyService.notifyTableToRefresh();
              this.notifyService.notifyTabChange();
            },
            error: (error) => {
              this.loading = false;
              this.error = typeof error === 'string' ? error : error.message;
            },
          });
      } else {
        this.caseService
          .createCase(this.caseForm.getRawValue())
          .pipe(takeUntil(this.destroyForm$))
          .subscribe({
            next: (data) => {
              this.loading = false;
              this.caseForm.reset();
              this.notifyService.notifyTableToRefresh();
            },
            error: (error) => {
              this.loading = false;
              this.error = typeof error === 'string' ? error : error.message;
            },
          });
      }
      this.loading = false;
    } else {
      this.caseForm.markAllAsTouched();
    }
  }
}
