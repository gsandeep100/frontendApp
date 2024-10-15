import { Routes, RouterModule } from '@angular/router';
import {CasesFormComponent} from './components/cases-form/cases-form.component';
import {CasesListComponent} from './components/cases-list/cases-list.component';
import {CasesTabComponent} from './components/cases-tab/cases-tab.component';
import {LoginComponent} from './components/login/login.component';
import {ModalComponent} from './components/modal/modal.component';
import {NgModule} from '@angular/core';

const routes: Routes = [
  {
    path: '/cases',
    component: ModalComponent
  },
  {
    path: '/cases',
    component: CasesFormComponent
  },
  {
    path: '/cases',
    component: CasesListComponent
  },
  {
    path: '/cases',
    component: CasesTabComponent
  },
  {
    path: '/auth',
    component: LoginComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
