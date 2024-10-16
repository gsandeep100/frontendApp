import {Component, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule, NgIf} from "@angular/common";
import {Subject, takeUntil} from 'rxjs';
import {ModalComponent} from '../modal/modal.component';
import {CasesTabComponent} from '../cases-tab/cases-tab.component';
import {ManageUserService} from '../../../services/manage-user.service';
import {UserService} from '../../../services/user.service';
import {Login} from '../../../models/login';
import {User} from '../../../models/user';
import {MatDialogConfig, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'add-user',
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    CasesTabComponent,
    FormsModule,
    ReactiveFormsModule
  ] , // Import components
  templateUrl: './adduser.component.html',
  styleUrl: './adduser.component.css',
})

export class AdduserComponent implements OnDestroy{
  firstname: string = '';
  lastname: string = '';
  email: string = '';
  password: string = '';
  role: string = '';
  createUserForm: FormGroup; // Declare FormGroup
  private destroy$: Subject<void> = new Subject<void>();
  error = '';
  userValues: Login = new User();

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dataService: ManageUserService,
    private dialogRef: MatDialogRef<AdduserComponent>
  ) {
    this.createUserForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required],
    });
    this.dataService.data$.subscribe((value) => {
      if (!value) return;
      this.createUserForm.patchValue({
        firstname: value.firstname,
        lastname: value.lastname,
        email: value.email,
        password: value.password,
        role: value.role
      });
      // console.log('Received data:', value);
    });
    // Initialize FormGroup in the constructor
  }

  onSubmit() {
    console.log("onSubmit clicked")

    // Implement your login logic here
    if (this.createUserForm.valid) {
      this.userValues = this.createUserForm.getRawValue();

      console.log('Email:', this.userValues.email);
      console.log('Password:', this.userValues.password);
      this.userService
        .addUser(this.userValues)
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

  Close() {
    this.dialogRef.close()
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected readonly oncancel = oncancel;
  protected readonly onclose = onclose;
}