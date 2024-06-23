import { Component, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge } from 'rxjs';
import { PrimaryLinkComponent } from '../../shared/components/UI/primary-link/primary-link.component';
import { MatButtonModule } from '@angular/material/button';

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
  ],
  templateUrl: './authentication-page.component.html',
  styleUrl: './authentication-page.component.scss',
})
export class AuthenticationPageComponent {
  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly password = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(30),
  ]);

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

  signInErrorSignals = {
    email: signal(''),
    password: signal(''),
  };

  signUpErrorSignals = {
    name: signal(''),
    email: signal(''),
    password: signal(''),
    confirmPassword: signal(''),
  };

  constructor() {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.signInErrorSignals.email.set('You must enter a value');
    } else if (this.email.hasError('email')) {
      this.signInErrorSignals.email.set('Not a valid email');
    } else {
      this.signInErrorSignals.email.set('');
    }
  }

  onSignInFormSubmit() {}

  onSignUpFormSubmit() {}
}
