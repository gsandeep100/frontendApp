import {Component, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ModalComponent} from '../modal/modal.component';
import {CasesTabComponent} from '../cases-tab/cases-tab.component';
import {LoginService} from '../../../services/login.service';
import { ManageLoginService } from '../../../services/manage-login.service';

import {Subject, takeUntil} from 'rxjs';
import {Login} from '../../../models/login';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    CasesTabComponent,
    FormsModule,
    ReactiveFormsModule
  ] , // Import components
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnDestroy {
  email: string = '';
  password: string = '';
  loginForm: FormGroup; // Declare FormGroup
  private destroy$: Subject<void> = new Subject<void>();
  //loading: boolean = false;
  error = '';
  loginValues: Login = new Login();
  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private dataService: ManageLoginService,
  ) {
    this.loginForm = this.fb.group({
      user: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.dataService.data$.subscribe((value) => {
      if (!value) return;
      this.loginForm.patchValue({
        title: value.email,
        caseNumber: value.password
      });
      // console.log('Received data:', value);
    });
    // Initialize FormGroup in the constructor
  }

  onSubmit() {

    // Implement your login logic here
    if (this.loginForm.valid) {
      this.loginValues = this.loginForm.getRawValue();

      console.log('Email:', this.loginValues.email);
      console.log('Password:', this.loginValues.password);
      this.loginService
        .getUserPassword(this.loginValues)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            // console.log('Updated case:', data);
            //this.loading = false;
            //this.notifyService.notifyTableToRefresh();
          },
          error: (error) => {
            console.log('There was an error!', error);
            //this.loading = false;
            this.error = typeof error === 'string' ? error : error.message;
          },
        });
      // Add authentication logic and navigate to the next page upon successful login
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
