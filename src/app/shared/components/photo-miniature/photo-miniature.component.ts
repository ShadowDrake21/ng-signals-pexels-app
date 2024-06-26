import { AsyncPipe, JsonPipe, NgOptimizedImage } from '@angular/common';
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
import { PhotoModalComponent } from './components/photo-modal/photo-modal.component';
import { AuthenticationService } from '../../../core/authentication/authentication.service';
import { DatabaseService } from '../../../core/services/database.service';
import { SnackbarTemplateComponent } from '../snackbar-template/snackbar-template.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, Observable, Subscription } from 'rxjs';

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
  private snackBar = inject(MatSnackBar);

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
            this.openSnackBar(
              `Photo added to favourites (document #${response})`
            );
            this.checkFavouriteMark();
          } else {
            this.openSnackBar(`Error while adding to favourites`);
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
          console.log(response);
          if (response) {
            this.openSnackBar(`Photo removed from favourites `);
            this.checkFavouriteMark();
            this.removingFromFavs.emit(this.photo().id);
          } else {
            this.openSnackBar(`Error while removing from favourites`);
          }
        })
      )
      .subscribe();

    this.subscriptions.push(deleteSubscription);
  }

  private openSnackBar(message: string) {
    this.snackBar.openFromComponent(SnackbarTemplateComponent, {
      data: { message },
      duration: 5000,
      horizontalPosition: 'left',
    });
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
