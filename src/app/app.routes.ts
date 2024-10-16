import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {CasesTabComponent} from './components/cases-tab/cases-tab.component';
export const routes: Routes = [
  { path: '', component: LoginComponent }, // Default route
  { path: '', component: CasesTabComponent }, // Default route
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
