// angular stuff
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import {
  catchError,
  delay,
  forkJoin,
  map,
  Observable,
  of,
  Subscription,
  timer,
} from 'rxjs';
import { ErrorResponse, Photo, Video } from 'pexels';
import { JsonPipe, NgClass } from '@angular/common';

// services
import { PhotosService } from '../../core/services/photos.service';
import { VideosService } from '../../core/services/videos.service';

// components
import { PhotoMiniatureComponent } from '../../shared/components/photo-miniature/photo-miniature.component';
import { PhotosListComponent } from './components/photos-list/photos-list.component';
import { VideoMiniatureComponent } from '../../shared/components/video-miniature/video-miniature.component';
import { VideosListComponent } from './components/videos-list/videos-list.component';
import { PrimaryLinkComponent } from '../../shared/components/UI/primary-link/primary-link.component';
import { ErrorTemplateComponent } from '../../shared/components/error-template/error-template.component';
import { LoadingTemplateComponent } from '../../shared/components/loading-template/loading-template.component';
import { SnackbarTemplateComponent } from '../../shared/components/snackbar-template/snackbar-template.component';
import { SnackbarService } from '../../core/services/snackbar.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    NgClass,
    JsonPipe,
    PhotoMiniatureComponent,
    PhotosListComponent,
    VideoMiniatureComponent,
    VideosListComponent,
    PrimaryLinkComponent,
    ErrorTemplateComponent,
    LoadingTemplateComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit, OnDestroy {
  private photosService = inject(PhotosService);
  private videosService = inject(VideosService);
  private snackbarService = inject(SnackbarService);

  photosLoading: boolean = true;
  videosLoading: boolean = true;

  photosSig = signal<Photo[]>([]);
  videosSig = signal<Video[]>([]);
  randomPhotoSig = signal<Photo | null>(null);
  popularVideoSig = signal<Video | null>(null);

  isPhotosError: boolean = false;
  isVideosError: boolean = false;
  isOtherError: boolean = false;

  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData() {
    const forkJoinSubscription = forkJoin([
      this.fetchPhotos().pipe(catchError(() => of(null))),
      this.fetchVideos().pipe(catchError(() => of(null))),
      this.fetchRandomPhoto().pipe(catchError(() => of(null))),
      this.fetchPopularVideo().pipe(catchError(() => of(null))),
    ])
      .pipe(delay(2000))
      .subscribe({
        next: () => {
          const timerSubscription = timer(300).subscribe(() => {
            this.photosLoading = false;
            this.videosLoading = false;
          });

          this.subscriptions.push(timerSubscription);
        },
        error: () => {
          this.photosLoading = false;
          this.videosLoading = false;
          this.snackbarService.openSnackbar('Error fetching data');
        },
        complete: () => {
          this.photosLoading = false;
          this.videosLoading = false;
        },
      });

    this.subscriptions.push(forkJoinSubscription);
  }

  fetchPhotos(): Observable<void> {
    return this.photosService.searchPhotos('Poland').pipe(
      map((response) => {
        if (response && 'photos' in response && 'total_results' in response) {
          return { type: 'success', data: response.photos };
        } else {
          throw response;
        }
      }),
      map((result) => {
        if (result.type === 'success') {
          this.photosSig.set(result.data);
        }
      }),
      catchError((error: ErrorResponse) => {
        this.snackbarService.openSnackbar('Error fetching data');
        this.isPhotosError = true;

        // this.videosLoading = false;
        return of();
      })
    );
  }

  fetchVideos(): Observable<void> {
    return this.videosService.searchVideos('money', { per_page: 4 }).pipe(
      map((response) => {
        if (response && 'videos' in response && 'total_results' in response) {
          return { type: 'success', data: response.videos };
        } else {
          throw response;
        }
      }),
      map((result) => {
        if (result.type === 'success') {
          this.videosSig.set(result.data);
        }
      }),
      catchError((error: ErrorResponse) => {
        this.isVideosError = true;
        return of();
      })
    );
  }

  fetchRandomPhoto(): Observable<void> {
    return this.photosService.getRandomPhoto().pipe(
      map((response) => {
        if ('id' in response) {
          return { type: 'success', photo: response };
        } else {
          throw response;
        }
      }),
      map((result) => {
        if (result.type === 'success') {
          this.randomPhotoSig.set(result.photo);
        }
      }),
      catchError((error: ErrorResponse) => this.handleOtherError())
    );
  }

  fetchPopularVideo(): Observable<void> {
    return this.videosService.getPopularVideos({ per_page: 1 }).pipe(
      map((response) => {
        if (response && 'videos' in response && 'total_results' in response) {
          return { type: 'success', data: response.videos[0] as Video };
        } else {
          throw response;
        }
      }),
      map((result) => {
        if (result.type === 'success') {
          this.popularVideoSig.set(result.data);
        }
      }),
      catchError((error: ErrorResponse) => this.handleOtherError())
    );
  }

  private handleOtherError(): Observable<never> {
    this.isOtherError = true;
    return of();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
