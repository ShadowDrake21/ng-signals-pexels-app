import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import { LoadingTemplateComponent } from '../../shared/components/loading-template/loading-template.component';
import { SingleCollectionPhotosComponent } from '../single-collection/components/single-collection-photos/single-collection-photos.component';
import { SingleCollectionVideosComponent } from '../single-collection/components/single-collection-videos/single-collection-videos.component';
import { DatabaseService } from '../../core/services/database.service';
import { Photo, Video } from 'pexels';
import {
  combineLatest,
  delay,
  forkJoin,
  Observable,
  Subscription,
  tap,
} from 'rxjs';
import { PhotoMiniatureComponent } from '../../shared/components/photo-miniature/photo-miniature.component';
import { VideoMiniatureComponent } from '../../shared/components/video-miniature/video-miniature.component';
import { PhotosService } from '../../core/services/photos.service';
import { VideosService } from '../../core/services/videos.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { NoResultsComponent } from '../../shared/components/no-results/no-results.component';

@Component({
  selector: 'app-user-favourites',
  standalone: true,
  imports: [
    RouterLink,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    LoadingTemplateComponent,
    SingleCollectionPhotosComponent,
    SingleCollectionVideosComponent,
    PhotoMiniatureComponent,
    VideoMiniatureComponent,
    MatPaginatorModule,
    NoResultsComponent,
  ],
  templateUrl: './user-favourites.component.html',
  styleUrl: './user-favourites.component.scss',
})
export class UserFavouritesComponent implements OnInit, OnDestroy {
  private databaseService = inject(DatabaseService);
  private photosService = inject(PhotosService);
  private videosService = inject(VideosService);

  photosSig = signal<Photo[]>([]);
  photosIdsSig = signal<number[]>([]);
  photosErrorSig = signal<string>('');
  photosPerPage: number = 10;

  photosPageSig = signal<number>(0);

  videosSig = signal<Video[]>([]);
  videosIdsSig = signal<number[]>([]);
  videosErrorSig = signal<string>('');
  videosPerPage: number = 4;
  videosPageSig = signal<number>(0);

  loading: boolean = true;

  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.favouriteIdsFetch();
  }

  favouriteIdsFetch() {
    const fetchIdsSubscription = forkJoin([
      this.databaseService.getSubcollectionFromDB('photos') as Observable<
        number[]
      >,
      this.databaseService.getSubcollectionFromDB('videos') as Observable<
        number[]
      >,
    ])
      .pipe(
        delay(2000),
        tap(() => (this.loading = false))
      )
      .subscribe(([photosIds, videosIds]) => {
        this.photosIdsSig.set(photosIds);
        this.videosIdsSig.set(videosIds);

        this.fetchPhotos(0);
        this.fetchVideos(0);
      });

    this.subscriptions.push(fetchIdsSubscription);
  }

  fetchPhotos(page: number) {
    const photoIds = this.photosIdsSig().slice(
      page * this.photosPerPage,
      page * this.photosPerPage + this.photosPerPage
    );

    this.photosSig.set([]);

    photoIds.forEach((id) => {
      const getPhotoSubscription = this.photosService
        .getPhoto(id)
        .subscribe((value) => {
          if (value) {
            this.photosSig.update((prevArr) => [...prevArr, value]);
          }
        });

      this.subscriptions.push(getPhotoSubscription);
    });
  }

  fetchVideos(page: number) {
    const videoIds = this.videosIdsSig().slice(
      page * this.videosPerPage,
      page * this.videosPerPage + this.videosPerPage
    );

    this.videosSig.set([]);

    videoIds.forEach((id) => {
      const getVideoSubscription = this.videosService
        .getVideo(id)
        .subscribe((value) => {
          if (value) {
            this.videosSig.update((prevArr) => [...prevArr, value]);
          }
        });

      this.subscriptions.push(getVideoSubscription);
    });
  }

  handleFavouriteRemoval(id: number, type: 'photos' | 'videos') {
    if (type === 'photos') {
      this.photosSig.update((prevArr) =>
        prevArr.filter((item) => item.id !== id)
      );
      this.photosIdsSig.update((prevArr) =>
        prevArr.filter((item) => item !== id)
      );

      if (!this.photosSig().length) {
        this.onPaginatorChange(
          {
            length: this.photosIdsSig().length,
            pageIndex: this.photosPageSig() - 1,
            pageSize: this.photosPerPage,
            previousPageIndex: this.photosPageSig(),
          },
          'photos'
        );
      }
    } else {
      this.videosSig.update((prevArr) =>
        prevArr.filter((item) => item.id !== id)
      );
      this.videosIdsSig.update((prevArr) =>
        prevArr.filter((item) => item !== id)
      );

      if (!this.videosSig().length) {
        this.onPaginatorChange(
          {
            length: this.videosIdsSig().length,
            pageIndex: this.videosPageSig() - 1,
            pageSize: this.videosPerPage,
            previousPageIndex: this.videosPageSig(),
          },
          'videos'
        );
      }
    }
  }

  onPaginatorChange(event: PageEvent, type: 'photos' | 'videos') {
    if (type === 'photos') {
      this.fetchPhotos(event.pageIndex);
      this.photosPageSig.set(event.pageIndex);
    } else {
      this.fetchVideos(event.pageIndex);
      this.videosPageSig.set(event.pageIndex);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
