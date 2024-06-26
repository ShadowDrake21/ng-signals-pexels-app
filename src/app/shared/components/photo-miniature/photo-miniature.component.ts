// angular stuff
import { AsyncPipe } from '@angular/common';
import {
  Component,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { Photo } from 'pexels';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { map, Observable, Subscription } from 'rxjs';

// components
import { PhotoModalComponent } from './components/photo-modal/photo-modal.component';

// services
import { AuthenticationService } from '../../../core/authentication/authentication.service';
import { DatabaseService } from '../../../core/services/database.service';
import { SnackbarService } from '../../../core/services/snackbar.service';

@Component({
  selector: 'app-photo-miniature',
  standalone: true,
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './photo-miniature.component.html',
  styleUrl: './photo-miniature.component.scss',
})
export class PhotoMiniatureComponent implements OnInit, OnDestroy {
  private authenticationService = inject(AuthenticationService);
  private databaseService = inject(DatabaseService);
  private snackBarService = inject(SnackbarService);

  readonly modal = inject(MatDialog);

  photo = input.required<Photo>();

  markedAsFavourite$!: Observable<boolean>;
  isLikeableSig = signal<boolean>(true);

  removingFromFavs = output<number>();

  private subscriptions: Subscription[] = [];

  openModal() {
    this.modal.open(PhotoModalComponent, {
      data: { item: this.photo() },
    });
  }

  ngOnInit(): void {
    const userAuthSubscription =
      this.authenticationService.isUserAuth.subscribe((value) => {
        this.isLikeableSig.set(value);

        if (value) {
          this.checkFavouriteMark();
        }
      });

    this.subscriptions.push(userAuthSubscription);
  }

  onAddToFavs(): void {
    const addSubscription = this.databaseService
      .addToFavourites('photos', this.photo().id)
      .pipe(
        map((response) => {
          if (response) {
            this.snackBarService.openSnackbar(
              `Photo added to favourites (document #${response})`
            );
            this.checkFavouriteMark();
          } else {
            this.snackBarService.openSnackbar(
              `Error while adding to favourites`
            );
          }
        })
      )
      .subscribe();

    this.subscriptions.push(addSubscription);
  }

  onDeleteFromFavs(): void {
    const deleteSubscription = this.databaseService
      .deleteFromFavourites('photos', this.photo().id)
      .pipe(
        map((response) => {
          if (response) {
            this.snackBarService.openSnackbar(`Photo removed from favourites `);
            this.checkFavouriteMark();
            this.removingFromFavs.emit(this.photo().id);
          } else {
            this.snackBarService.openSnackbar(
              `Error while removing from favourites`
            );
          }
        })
      )
      .subscribe();

    this.subscriptions.push(deleteSubscription);
  }

  private checkFavouriteMark() {
    this.markedAsFavourite$ = this.databaseService.checkInFavourites(
      'photos',
      this.photo().id
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
