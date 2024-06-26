// angular stuff
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';

// components
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ExpireModalComponent } from './components/expire-modal/expire-modal.component';

// services
import { ThemeService } from './core/services/theme.service';
import { AuthenticationService } from './core/authentication/authentication.service';

// utils
import {
  removeItemFromLC,
  retrieveItemFromLC,
} from './shared/utils/localStorage.utils';

// models
import { IUserDataToLC } from './shared/models/auth.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  private authenticationService = inject(AuthenticationService);

  private themeService = inject(ThemeService);
  private router = inject(Router);

  themeSig = signal<string>('');
  isAuthenticationSig = signal<boolean>(false);

  private destroy$$ = new Subject<void>();

  ngOnInit(): void {
    this.checkAuthExpirationDate();

    this.themeSig = this.themeService.getThemeSignal();

    this.router.events
      .pipe(takeUntil(this.destroy$$))
      .subscribe((event: any) => {
        if (event instanceof NavigationEnd) {
          if (this.router.url === '/authentication') {
            this.isAuthenticationSig.set(true);
          } else {
            this.isAuthenticationSig.set(false);
          }
        }
      });
  }

  checkAuthExpirationDate() {
    const user: IUserDataToLC = retrieveItemFromLC('user');

    if (user) {
      if (new Date(user.expireTime) < new Date()) {
        removeItemFromLC('user');
        this.authenticationService.signOut();

        this.dialog.open(ExpireModalComponent, {
          width: '500px',
        });
      }
    }
  }
}
