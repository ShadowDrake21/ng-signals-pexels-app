import { Component, OnInit, signal, WritableSignal } from '@angular/core';
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
import { merge, Observable, of } from 'rxjs';
import { PrimaryLinkComponent } from '../../shared/components/UI/primary-link/primary-link.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { PasswordValidator } from './validators/password.validators';

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
  ],
  templateUrl: './authentication-page.component.html',
  styleUrl: './authentication-page.component.scss',
})
export class AuthenticationPageComponent {
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
    console.log('SignInForm', this.signInForm.value);
  }

  onSignUpFormSubmit() {
    console.log('SignUpForm', this.signUpForm.value);
  }
}
