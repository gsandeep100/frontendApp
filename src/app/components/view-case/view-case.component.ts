import { Component } from '@angular/core';
import { Cases } from '../../models/case';
import { ManageCaseService } from '../../services/manage-case.service';

@Component({
  selector: 'app-view-case',
  standalone: true,
  imports: [],
  templateUrl: './view-case.component.html',
})
export class ViewCaseComponent {
  selectedCase: Cases | null = null;
  constructor(private dataService: ManageCaseService) {}

  ngOnInit(): void {
    this.dataService.data$.subscribe((value) => {
      if (!value) return;
      this.selectedCase = value;
    });
  }
}
