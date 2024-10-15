import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import {ReactiveFormsModule} from '@angular/forms';
import {CasesFormComponent} from './components/cases-form/cases-form.component';
import {CasesListComponent} from './components/cases-list/cases-list.component';
import {CasesTabComponent} from './components/cases-tab/cases-tab.component';
import {LoginComponent} from './components/login/login.component';
import {ModalComponent} from './components/modal/modal.component';

// @ts-ignore
@NgModule({

  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    CasesFormComponent,
    CasesListComponent,
    CasesTabComponent,
    LoginComponent,
    ModalComponent
  ],
  providers: [],
  bootstrap:  []
})
export class AppModule {AppComponent: any }
