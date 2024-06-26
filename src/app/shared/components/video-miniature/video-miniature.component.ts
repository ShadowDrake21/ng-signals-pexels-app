// angular stuff
import {
  Component,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { Video } from 'pexels';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { map, Observable, Subscription } from 'rxjs';
import { AsyncPipe } from '@angular/common';

// components
import { VideoModalComponent } from './components/video-modal/video-modal.component';

// services
import { AuthenticationService } from '../../../core/authentication/authentication.service';
import { DatabaseService } from '../../../core/services/database.service';
import { SnackbarService } from '../../../core/services/snackbar.service';

// utils
import { getAppropriateVideo } from '../../utils/video.utils';

@Component({
  selector: 'app-video-miniature',
  standalone: true,
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './video-miniature.component.html',
  styleUrl: './video-miniature.component.scss',
})
export class VideoMiniatureComponent implements OnInit {
  private authenticationService = inject(AuthenticationService);
  private databaseService = inject(DatabaseService);
  private snackBarService = inject(SnackbarService);

  readonly modal = inject(MatDialog);

  video = input.required<Video>();

  markedAsFavourite$!: Observable<boolean>;
  isLikeableSig = signal<boolean>(true);

  getAppropriateVideo = getAppropriateVideo;

  removingFromFavs = output<number>();

  private subscriptions: Subscription[] = [];

  openModal() {
    this.modal.open(VideoModalComponent, {
      data: { item: this.video() },
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
      .addToFavourites('videos', this.video().id)
      .pipe(
        map((response) => {
          if (response) {
            this.snackBarService.openSnackbar(
              `Video added to favourites (document #${response})`
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
      .deleteFromFavourites('videos', this.video().id)
      .pipe(
        map((response) => {
          if (response) {
            this.snackBarService.openSnackbar(`Video removed from favourites`);
            this.checkFavouriteMark();
            this.removingFromFavs.emit(this.video().id);
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
      'videos',
      this.video().id
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
