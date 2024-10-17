import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Login } from '../../models/login';
import { User } from '../../models/user';
import { ManageUserService } from '../../services/manage-user.service';
import { UserService } from '../../services/user.service';
import {RouterOutlet} from '@angular/router';
import {DataService} from '../../services/data.service';

@Component({
  selector: 'add-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterOutlet,
  ], // Import components
  templateUrl: './adduser.component.html',
})

export class AdduserComponent implements OnDestroy {
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
    private notifyService: DataService
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
        role: value.role,
      });
    });
  }

  ngOnInit() {
  }

  openModal(type: string) {
    this.error = '';
  }

  onSubmit() {
    console.log('onSubmit clicked');

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
            this.notifyService.notifyRegistrationChange();
            this.error = '';
          },
          error: (error) => {
            console.log('There was an error!', error);
            this.error = typeof error === 'string' ? error : error.message;
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected readonly oncancel = oncancel;
  protected readonly onclose = onclose;
}
