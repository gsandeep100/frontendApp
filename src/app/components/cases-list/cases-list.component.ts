import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CasesService } from '../../../services/cases.service';
import { DataService } from '../../../services/data.service';
import { ManageCaseService } from '../../../services/manage-case.service';
import { CasesFormComponent } from '../cases-form/cases-form.component';
import { ModalComponent } from '../modal/modal.component';
export type Cases = {
  id: string;
  title: string;
  caseNumber: string;
  description: string;
  status: string;
};

@Component({
  standalone: true,
  selector: 'app-cases-list',
  imports: [CommonModule, ModalComponent, CasesFormComponent],
  templateUrl: './cases-list.component.html',
})
export class CasesListComponent implements OnInit {
  @ViewChild(ModalComponent) modalComponent!: ModalComponent;
  modalTitle: string = 'Edit Case';
  modalText: string = 'Please edit the case details in the form below.';

  isEdit = false;
  loading = false;
  caseList: Cases[] = [];
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private caseService: CasesService,
    private dataService: ManageCaseService,
    private loadingService: DataService
  ) {
    // this.loadCases();
  }

  loadCases() {
    this.loading = true;
    this.caseList = [];
    this.caseService
      .getCases<Cases[]>()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.caseList = data;
          this.loading = false;
        },
        error: (error) => {
          console.log('There was an error!', error);
          this.loading = false;
        },
      });
  }

  ngOnInit(): void {
    // Initial load
    this.loadCases();
    // Subscribe to refresh notification from the shared service
    this.loadingService.getRefreshTableObservable().subscribe(() => {
      this.loadCases();
    });
  }

  // onDelete(id: number) {
  //   this.http.delete(`your-api-url/cases/${id}`).subscribe(() => {
  //     this.loadCases();
  //   });
  // }

  openChildModal(type: string, item: Cases) {
    this.dataService.setData(item);
    this.modalComponent.openModal(type, item); // Open the modal
    if (type === 'edit') {
      this.isEdit = true;
    }
    // console.log(item);
  }
}
