import {
  Component,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { Video } from 'pexels';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { VideoModalComponent } from './components/video-modal/video-modal.component';
import { getAppropriateVideo } from '../../utils/video.utils';
import { AuthenticationService } from '../../../core/authentication/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatabaseService } from '../../../core/services/database.service';
import { SnackbarTemplateComponent } from '../snackbar-template/snackbar-template.component';
import { map, Observable, Subscription } from 'rxjs';
import { AsyncPipe } from '@angular/common';

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
  private snackBar = inject(MatSnackBar);

  readonly modal = inject(MatDialog);

  video = input.required<Video>();

  markedAsFavourite$!: Observable<boolean>;
  isLikeableSig = signal<boolean>(true);

  getAppropriateVideo = getAppropriateVideo;

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
            this.openSnackBar(
              `Video added to favourites (document #${response})`
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
      .deleteFromFavourites('videos', this.video().id)
      .pipe(
        map((response) => {
          console.log(response);
          if (response) {
            this.openSnackBar(`Video removed from favourites`);
            this.checkFavouriteMark();
          } else {
            this.openSnackBar(`Error while removing from favourites`);
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

  private openSnackBar(message: string) {
    this.snackBar.openFromComponent(SnackbarTemplateComponent, {
      data: { message },
      duration: 5000,
      horizontalPosition: 'left',
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
