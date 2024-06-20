import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { PhotosService } from '../../core/services/photos.service';
import {
  catchError,
  delay,
  filter,
  forkJoin,
  map,
  Observable,
  of,
  Subscription,
  switchMap,
  timer,
} from 'rxjs';
import {
  PaginationParams,
  ErrorResponse,
  PhotosWithTotalResults,
  Photo,
  Photos,
  Videos,
  Video,
} from 'pexels';
import { PhotoMiniatureComponent } from '../../shared/components/photo-miniature/photo-miniature.component';
import { PhotosListComponent } from './components/photos-list/photos-list.component';
import { JsonPipe, NgClass } from '@angular/common';
import { VideosService } from '../../core/services/videos.service';
import { VideoMiniatureComponent } from '../../shared/components/video-miniature/video-miniature.component';
import { VideosListComponent } from './components/videos-list/videos-list.component';
import { PrimaryLinkComponent } from '../../shared/components/UI/primary-link/primary-link.component';
import { ErrorTemplateComponent } from '../../shared/components/error-template/error-template.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';

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
    LoadingComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit, OnDestroy {
  private photosService = inject(PhotosService);
  private videosService = inject(VideosService);

  photosLoading: boolean = false;
  videosLoading: boolean = false;

  photosSig = signal<Photo[]>([]);
  videosSig = signal<Video[]>([]);

  photosErrorSig = signal<ErrorResponse | null>(null);
  videosErrorSig = signal<ErrorResponse | null>(null);

  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.photosLoading = true;
    this.videosLoading = true;
    console.log('loading begins');

    const forkJoinSubscription = forkJoin([
      this.fetchPhotos(),
      this.fetchVideos(),
    ])
      .pipe(delay(2000))
      .subscribe(() => {
        const timerSubscription = timer(300).subscribe(() => {
          this.photosLoading = false;
          this.videosLoading = false;
        });

        this.subscriptions.push(timerSubscription);
      });

    this.subscriptions.push(forkJoinSubscription);
  }

  fetchPhotos(): Observable<void> {
    return this.photosService.searchPhotos('Poland').pipe(
      map((response) => {
        if ('photos' in response && 'total_results' in response) {
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
        this.photosErrorSig.set(error);
        return of();
      })
    );

    // this.subscriptions.push(photosSubscription);
  }

  fetchVideos(): Observable<void> {
    return this.videosService.searchVideo('money', { per_page: 4 }).pipe(
      map((response) => {
        if ('videos' in response && 'total_results' in response) {
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
        this.videosErrorSig.set(error);
        return of();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
