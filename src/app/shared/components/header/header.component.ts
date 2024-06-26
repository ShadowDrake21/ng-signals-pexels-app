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
import { Subscription } from 'rxjs';

// services
import { AuthenticationService } from '../../../core/authentication/authentication.service';

// services
import { ThemeService } from '../../../core/services/theme.service';
import { retrieveItemFromLC } from '../../utils/localStorage.utils';
import { IUserDataToLC } from '../../models/auth.model';
import { TruncateTextPipe } from '../../pipes/truncate-text.pipe';

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
  isSignOutSig = signal<boolean>(false);

  userName: string = '';

  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.themeSig = this.themeService.getThemeSignal();

    const checkAuthSubscription =
      this.authenticationService.isUserAuth.subscribe((value) => {
        this.isSignOutSig.set(value);

        if (value) {
          this.userName = (retrieveItemFromLC('user') as IUserDataToLC).name;
        } else {
          this.userName = '';
        }
      });

    this.subscriptions.push(checkAuthSubscription);
  }

  handleToggleTheme() {
    this.themeService.toggleTheme();
  }

  handleSetTheme() {}

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
