// angular stuff
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import { Photo, Video } from 'pexels';
import { delay, forkJoin, Observable, Subscription, tap } from 'rxjs';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

// components
import { LoadingTemplateComponent } from '../../shared/components/loading-template/loading-template.component';
import { SingleCollectionPhotosComponent } from '../single-collection/components/single-collection-photos/single-collection-photos.component';
import { SingleCollectionVideosComponent } from '../single-collection/components/single-collection-videos/single-collection-videos.component';
import { PhotoMiniatureComponent } from '../../shared/components/photo-miniature/photo-miniature.component';
import { VideoMiniatureComponent } from '../../shared/components/video-miniature/video-miniature.component';
import { NoResultsComponent } from '../../shared/components/no-results/no-results.component';

// services
import { PhotosService } from '../../core/services/photos.service';
import { VideosService } from '../../core/services/videos.service';
import { DatabaseService } from '../../core/services/database.service';

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
      .subscribe({
        next: ([photosIds, videosIds]) => {
          this.photosIdsSig.set(photosIds);
          this.videosIdsSig.set(videosIds);

          this.fetchPhotos(0);
          this.fetchVideos(0);
        },
        error: (error) => {
          this.photosErrorSig.set('Failed to fetch photos');
          this.videosErrorSig.set('Failed to fetch videos');
        },
      });

    this.subscriptions.push(fetchIdsSubscription);
  }

  fetchPhotos(page: number) {
    this.updateItems(
      this.photosIdsSig,
      this.photosPerPage,
      page,
      this.photosService.getPhoto.bind(this.photosService),
      this.photosSig,
      this.photosErrorSig
    );
  }

  fetchVideos(page: number) {
    this.updateItems(
      this.videosIdsSig,
      this.videosPerPage,
      page,
      this.videosService.getVideo.bind(this.videosService),
      this.videosSig,
      this.videosErrorSig
    );
  }

  private updateItems<T>(
    idsSignal: WritableSignal<number[]>,
    itemsPerPage: number,
    page: number,
    fetchItem: (id: number) => Observable<T>,
    itemsSignal: WritableSignal<T[]>,
    errorSignal: WritableSignal<string>
  ) {
    const itemsIds = idsSignal().slice(
      page * itemsPerPage,
      page * itemsPerPage + itemsPerPage
    );
    itemsSignal.set([]);

    itemsIds.forEach((id) => {
      const fetchItemSubscription = fetchItem(id).subscribe({
        next: (value) => {
          if (value) {
            itemsSignal.update((prevArr) => [...prevArr, value]);
          }
        },
        error: (error) => {
          errorSignal.set('Failed to fetch item');
        },
      });

      this.subscriptions.push(fetchItemSubscription);
    });
  }

  handleFavouriteRemoval(id: number, type: 'photos' | 'videos') {
    if (type === 'photos') {
      this.removeItem(
        id,
        this.photosSig,
        this.photosIdsSig,
        this.photosPerPage,
        this.photosPageSig,
        type
      );
    } else {
      this.removeItem(
        id,
        this.videosSig,
        this.videosIdsSig,
        this.videosPerPage,
        this.videosPageSig,
        type
      );
    }
  }

  private removeItem(
    id: number,
    itemsSignal: WritableSignal<any[]>,
    idsSignal: WritableSignal<number[]>,
    itemsPerPage: number,
    pageSignal: WritableSignal<number>,
    type: 'photos' | 'videos'
  ) {
    itemsSignal.update((prevArr) => prevArr.filter((item) => item.id !== id));
    idsSignal.update((prevArr) => prevArr.filter((item) => item !== id));

    if (!itemsSignal().length && pageSignal() > 0) {
      this.onPaginatorChange(
        {
          length: idsSignal().length,
          pageIndex: pageSignal() - 1,
          pageSize: itemsPerPage,
          previousPageIndex: pageSignal(),
        },
        type
      );
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
