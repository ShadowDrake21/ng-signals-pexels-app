import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { PexelsService } from './core/services/pexels.service';
import { HeaderComponent } from './shared/components/header/header.component';
import { ThemeService } from './core/services/theme.service';
import { FooterComponent } from './shared/components/footer/footer.component';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import {
  removeItemFromLC,
  retrieveItemFromLC,
} from './shared/utils/localStorage.utils';
import { IUserDataToLC } from './shared/models/auth.model';
import { AuthenticationService } from './core/authentication/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { ExpireModalComponent } from './components/expire-modal/expire-modal.component';

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
      console.log('user ');
      console.log(new Date(user.expireTime), new Date());
      if (new Date(user.expireTime) < new Date()) {
        console.log('user removal');
        removeItemFromLC('user');
        this.authenticationService.signOut();

        this.dialog.open(ExpireModalComponent, {
          width: '500px',
        });
      }
    }
  }
}
