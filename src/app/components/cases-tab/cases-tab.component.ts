import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Cases } from '../../models/case';
import { DataService } from '../../services/data.service';
import { CasesFormComponent } from '../cases-form/cases-form.component';
import { CasesListComponent } from '../cases-list/cases-list.component';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-cases-tab',
  standalone: true,
  imports: [
    CommonModule,
    CasesListComponent,
    CasesFormComponent,
    ModalComponent,
  ],
  templateUrl: './cases-tab.component.html',
})
export class CasesTabComponent {
  @ViewChild(ModalComponent) modalComponent!: ModalComponent;

  activeTab: string = 'Create Case'; // Default tab is 'Create Case'

  tabs: string[] = ['Create Case', 'List Case'];

  selectedCase: Cases | null = null;

  constructor(private dataService: DataService) {}

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  ngOnInit() {
    // Set default tab to 'Create Case' and subscribe to observable
    this.dataService.getRefreshTableObservable().subscribe(() => {
      this.setActiveTab('List Case');
    });
  }
}
