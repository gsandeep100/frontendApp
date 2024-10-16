import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { CasesFormComponent } from '../cases-form/cases-form.component';
import { Cases, CasesListComponent } from '../cases-list/cases-list.component';
import { ModalComponent } from '../modal/modal.component';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-cases-tab',
  standalone: true,
  imports: [
    CommonModule,
    CasesListComponent,
    CasesFormComponent,
    ModalComponent,
    RouterOutlet,
  ], // Import components
  templateUrl: './cases-tab.component.html',
})
export class CasesTabComponent {
  @ViewChild(ModalComponent) modalComponent!: ModalComponent;
  activeTab: string = 'Create Case'; // Default tab is 'create'

  tabs: string[] = ['Create Case', 'List Case']; // Tabs

  selectedCase: Cases | null = null;

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}
