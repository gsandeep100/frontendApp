import {CommonModule} from '@angular/common';
import {Component, OnDestroy, ViewChild} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {ModalComponent} from '../modal/modal.component';

import {RouterOutlet} from '@angular/router';
import {Subject, takeUntil} from 'rxjs';
import {Login} from '../../models/login';
import {DataService} from '../../services/data.service';
import {LoginService} from '../../services/login.service';
import {ManageLoginService} from '../../services/manage-login.service';
import {Log} from '../../../utils/log.decorator';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    FormsModule,
    ReactiveFormsModule,
    RouterOutlet,
  ], // Import components
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnDestroy {
  @ViewChild(ModalComponent) modalComponent!: ModalComponent;
  modalTitle: string = 'Edit Case';
  modalText: string = 'Please edit the case details in the form below.';

  email: string = '';
  password: string = '';
  loginForm: FormGroup; // Declare FormGroup
  private destroy$: Subject<void> = new Subject<void>();
  error = '';
  loginValues: Login = new Login();

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private dataService: ManageLoginService,
    private notifyService: DataService
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.dataService.data$.subscribe((value) => {
      if (!value) return;
      this.loginForm.patchValue({
        title: value.email,
        caseNumber: value.password,
      });
    });
  }

  ngOnInit(): void {
    this.error = '';
    this.notifyService.getRegistrationChangeObservable().subscribe(() => {
      this.closeChildModal();
    });
  }

  onSubmit() {
    console.log('onSubmit clicked');

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
            console.log('Updated case:', data);
            if (data) {
              this.notifyService.notifyLoginChange();
            }
            //this.loading = false;
            //this.notifyService.notifyTableToRefresh();
          },
          error: (error) => {
            console.log('There was an error!', error);
            //this.loading = false;
            this.error = typeof error === 'string' ? error : error.message;
          },
        });
    }
  }

  @Log({inputs: true, outputs: false})
  openChildModal(type: string, title: string) {
    this.modalComponent.openModalRegistration(type, title); // Open the modal with the selected case
  }

  closeChildModal() {
    this.modalComponent.closeModal(); // Close the modal
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
