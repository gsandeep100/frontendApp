import { Routes } from '@angular/router';
import { CasesTabComponent } from './components/cases-tab/cases-tab.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
  { path: '', component: CasesTabComponent }, // Default route
  // Not found route
  {
    path: '**',
    component: NotFoundComponent,
  },
];

export class AppRoutingModule {}
