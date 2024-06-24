import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  AbstractControlOptions,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, delay, merge, Observable, of, tap } from 'rxjs';
import { PrimaryLinkComponent } from '../../shared/components/UI/primary-link/primary-link.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { AuthenticationService } from '../../core/authentication/authentication.service';
import { Router } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FirebaseError } from '@angular/fire/app';
import { SnackbarTemplateComponent } from '../../shared/components/snackbar-template/snackbar-template.component';

type SignInControlNames = 'email' | 'password';
type SignUpControlNames = 'name' | 'email' | 'password' | 'confirmPassword';

@Component({
  selector: 'app-authentication-page',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    PrimaryLinkComponent,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatProgressBarModule,
    MatSnackBarModule,
  ],
  templateUrl: './authentication-page.component.html',
  styleUrl: './authentication-page.component.scss',
})
export class AuthenticationPageComponent {
  private authenticationService = inject(AuthenticationService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  signInForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(20),
    ]),
  });

  signUpForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(30),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(20),
    ]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  signInErrorSignals: Record<SignInControlNames, WritableSignal<string>> = {
    email: signal(''),
    password: signal(''),
  };

  signUpErrorSignals: Record<SignUpControlNames, WritableSignal<string>> = {
    name: signal(''),
    email: signal(''),
    password: signal(''),
    confirmPassword: signal(''),
  };

  loading: boolean = false;

  constructor() {
    this.initializeErrorHandling('sign-in');
    this.initializeErrorHandling('sign-up');
  }

  private initializeErrorHandling(type: 'sign-in' | 'sign-up') {
    if (type === 'sign-in') {
      this.setupErrorHandling(
        this.signInForm.controls,
        this.signInErrorSignals
      );
    } else {
      this.setupErrorHandling(
        this.signUpForm.controls,
        this.signUpErrorSignals
      );
    }
  }

  private setupErrorHandling<T extends { [key: string]: FormControl<any> }>(
    controls: T,
    errorSignals: { [K in keyof T]: WritableSignal<string> }
  ) {
    Object.keys(controls).forEach((key) => {
      const control = controls[key as keyof T];
      const touchedObservables = of(control.touched);
      merge(control.statusChanges, control.valueChanges, touchedObservables)
        .pipe(takeUntilDestroyed())
        .subscribe(() =>
          this.updateErrorMessage(key as keyof T, control, errorSignals)
        );
    });
  }

  updateErrorMessage<T extends { [key: string]: FormControl<any> }>(
    controlName: keyof T,
    control: FormControl<any>,
    errorSignals: { [K in keyof T]: WritableSignal<string> }
  ) {
    let message = '';
    if (control.hasError('required')) {
      message = 'You must enter a value';
    } else if (control.hasError('minlength')) {
      message = `Must be at least ${
        control.getError('minlength').requiredLength
      } letters long`;
    } else if (control.hasError('maxlength')) {
      message = `Must be shorter than ${
        control.getError('maxlength').requiredLength
      } letters long`;
    } else if (controlName === 'email' && control.hasError('email')) {
      message = 'Not a valid email';
    }

    errorSignals[controlName].set(message);
  }

  onSignInFormSubmit() {
    const { email, password } = this.signInForm.value;
    this.loading = true;

    if (email && password) {
      this.authenticationService
        .signIn({ email, password })
        .pipe(
          delay(500),
          tap(() => (this.loading = false))
        )
        .subscribe({
          next: () => this.router.navigate(['/home']),
          error: (error: FirebaseError) => {
            this.openSnackBar(error.message);
            this.signInForm.reset();
            this.loading = false;
          },
        });
    } else {
      return;
    }
  }

  onSignUpFormSubmit() {
    const { name, email, password } = this.signUpForm.value;
    this.loading = true;

    if (name && email && password) {
      this.authenticationService
        .signUp({ name, email, password })
        .pipe(
          delay(500),
          tap(() => (this.loading = false))
        )
        .subscribe({
          next: () => this.router.navigate(['/home']),
          error: (error: FirebaseError) => {
            this.openSnackBar(error.message);
            this.loading = false;
          },
        });
    } else {
      return;
    }
  }

  private openSnackBar(message: string) {
    this.snackBar.openFromComponent(SnackbarTemplateComponent, {
      data: { error: message },
      duration: 5000,
      horizontalPosition: 'start',
    });
  }
}
