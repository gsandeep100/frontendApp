import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CasesService } from '../../../services/cases.service';
import { DataService } from '../../../services/data.service';
import { CasesFormComponent } from '../cases-form/cases-form.component';
import { Cases } from '../cases-list/cases-list.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, CasesFormComponent],
  templateUrl: './modal.component.html',
})
export class ModalComponent implements OnInit {
  @Input() modalTitle: string = 'Default Title'; // Dynamic title
  @Input() modalText: string = 'Default content'; // Dynamic content
  @Input() modalType: string = '';
  @Input() selectedCase: Cases | null = null;
  isDeleting: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();

  isModalOpen: boolean = false;

  constructor(
    private caseService: CasesService,

    private notifyService: DataService
  ) {}

  openModal(type: string, item: Cases) {
    this.isModalOpen = true;
    this.modalType = type;
    this.selectedCase = item;
    // this.dataService.setData(item);
    // console.log('Selected Case:', item, this.selectedCase);
    if (type === 'edit') {
      this.modalTitle = item?.title || 'Edit Case';
      this.modalText = 'Please edit the case details in the form below.';
    } else {
      this.modalTitle = 'Delete Case';
      this.modalText = 'Are you sure you want to delete this case?';
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.modalType = '';
    this.selectedCase = null;
    this.modalText = '';
    this.modalTitle = '';
  }

  ngOnInit() {
    this.isModalOpen = false;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onDelete() {
    this.isDeleting = true;
    if (this.selectedCase) {
      this.caseService
        .deleteCase(this.selectedCase.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            this.isDeleting = false;
            this.closeModal();
            this.notifyService.notifyTableToRefresh();
          },
          error: (error) => {
            console.log('There was an error!', error);
            this.isDeleting = false;
          },
        });
    }
  }
}
