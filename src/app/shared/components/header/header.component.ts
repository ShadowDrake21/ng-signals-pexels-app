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
import { ThemeService } from '../../../core/services/theme.service';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../../core/authentication/authentication.service';
import { Subscription } from 'rxjs';

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
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private themeService = inject(ThemeService);
  private authenticationService = inject(AuthenticationService);
  private router = inject(Router);

  isAuthHeader = input.required<boolean>();

  themeSig = signal<string>('');
  isSignOutSig = signal<boolean>(false);

  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.themeSig = this.themeService.getThemeSignal();

    const checkAuthSubscription =
      this.authenticationService.isUserAuth.subscribe((value) => {
        this.isSignOutSig.set(value);
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
