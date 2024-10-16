import { CommonModule } from '@angular/common';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CasesTabComponent } from '../cases-tab/cases-tab.component';
import { ModalComponent } from '../modal/modal.component';

import { MatDialog } from '@angular/material/dialog';
import { RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Login } from '../../models/login';
import { DataService } from '../../services/data.service';
import { LoginService } from '../../services/login.service';
import { ManageLoginService } from '../../services/manage-login.service';
import { AdduserComponent } from '../adduser/adduser.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    CasesTabComponent,
    FormsModule,
    ReactiveFormsModule,
    AdduserComponent,
    RouterOutlet,
  ], // Import components
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnDestroy {
  @ViewChild(AdduserComponent, { static: false })
  adduserComponent!: AdduserComponent;

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
    private dialog: MatDialog,
    private loginNotifyService: DataService
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
      // console.log('Received data:', value);
    });
    // Initialize FormGroup in the constructor
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
              this.loginNotifyService.notifyLoginChange();
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
      // Add authentication logic and navigate to the next page upon successful login
    }
  }

  onCreateNewUser() {
    const dialogRef = this.dialog.open(AdduserComponent, {
      width: '1800px',
      height: '756px',
      //data: {name: this.name, animal: this.animal},
      backdropClass: 'backdropBackground', // This is the "wanted" line
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });

    //const dialogConfig = new MatDialogConfig();
    //dialogConfig.width = '1800px';
    //dialogConfig.height = '756px';
    //dialogConfig.backdropClass = 'popupbackdropclass';
    //this.dialog.open(AdduserComponent,dialogConfig);
    //this.adduserComponent.openModal();
    //console.log("onCreateNewUser clicked")
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
