// angular stuff
import {
  Component,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { delay, map, Observable, Subscription, tap } from 'rxjs';

// services
import { AuthenticationService } from '../../../core/authentication/authentication.service';

// services
import { ThemeService } from '../../../core/services/theme.service';
import { retrieveItemFromLC } from '../../utils/localStorage.utils';
import { IUserDataToLC } from '../../models/auth.model';
import { TruncateTextPipe } from '../../pipes/truncate-text.pipe';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatMenuModule,
    RouterModule,
    TruncateTextPipe,
    AsyncPipe,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authenticationService = inject(AuthenticationService);
  private themeService = inject(ThemeService);
  private router = inject(Router);

  isAuthHeader = input.required<boolean>();

  themeSig = signal<string>('');
  isAuth = signal<boolean>(false);

  userName: string = '';

  auth$!: Observable<boolean>;

  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.themeSig = this.themeService.getThemeSignal();

    const authSubscription = this.authenticationService.isUserAuth
      .pipe(
        tap((authValue) => {
          this.isAuth.set(authValue);
          if (localStorage.getItem('user')) {
            this.userName = (retrieveItemFromLC('user') as IUserDataToLC).name;
          } else {
            this.userName = '';
          }
        })
      )
      .subscribe();

    this.subscriptions.push(authSubscription);
  }

  handleToggleTheme() {
    this.themeService.toggleTheme();
  }

  onSignOut() {
    const signOutSubscription = this.authenticationService
      .signOut()
      .subscribe(() => this.router.navigate(['/authentication']));

    this.subscriptions.push(signOutSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
