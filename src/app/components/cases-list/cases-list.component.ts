import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Cases } from '../../models/case';
import { CasesService } from '../../services/cases.service';
import { DataService } from '../../services/data.service';
import { ManageCaseService } from '../../services/manage-case.service';
import { CasesFormComponent } from '../cases-form/cases-form.component';
import { ModalComponent } from '../modal/modal.component';

@Component({
  standalone: true,
  selector: 'app-cases-list',
  imports: [ModalComponent, CasesFormComponent],
  templateUrl: './cases-list.component.html',
})
export class CasesListComponent implements OnInit {
  @ViewChild(ModalComponent) modalComponent!: ModalComponent;
  modalTitle: string = 'Edit Case';
  modalText: string = 'Please edit the case details in the form below.';
  isEdit = false;
  loading = true;
  error = '';
  caseList: Cases[] = [];
  private destroyList$: Subject<void> = new Subject<void>();

  constructor(
    private caseService: CasesService,
    private dataService: ManageCaseService,
    private loadingService: DataService
  ) {}

  ngOnInit(): void {
    this.error = '';
    this.loadCases();
    // Subscribe to refresh notification from the shared service
    this.loadingService.getRefreshTableObservable().subscribe(() => {
      this.loadCases();
      this.closeChildModal();
    });
  }

  ngOnDestroy(): void {
    this.destroyList$.next();
    this.destroyList$.complete();
  }

  loadCases() {
    this.loading = true;
    this.caseList = [];
    this.caseService
      .getCases<Cases[]>()
      .pipe(takeUntil(this.destroyList$))
      .subscribe({
        next: (data) => {
          // console.log('Cases loaded:', data);
          this.caseList = data;
          this.loading = false;
        },
        error: (error) => {
          // console.error('Error loading cases:', error);
          this.loading = false;
          this.error = typeof error === 'string' ? error : error.message;
        },
      });
  }

  openChildModal(type: string, item: Cases) {
    this.dataService.setData(item); // Set the current case data
    this.modalComponent.openModal(type, item); // Open the modal with the selected case
    this.isEdit = type === 'edit'; // Set isEdit based on action type
  }

  closeChildModal() {
    this.modalComponent.closeModal(); // Close the modal
    this.isEdit = false;
  }
}
