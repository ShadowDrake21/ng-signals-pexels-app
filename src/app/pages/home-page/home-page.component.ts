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
import { filter, map, Subscription, switchMap } from 'rxjs';
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
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit, OnDestroy {
  private photosService = inject(PhotosService);
  private videosService = inject(VideosService);

  photosSig = signal<Photo[]>([]);
  videosSig = signal<Video[]>([]);

  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.fetchPhotos();
    this.fetchVideos();
  }

  fetchPhotos() {
    const photosSubscription = this.photosService
      .searchPhotos('Poland')
      .pipe(
        filter(
          (response): response is PhotosWithTotalResults =>
            'photos' in response && 'total_results' in response
        ),
        map((photosWithResults) => photosWithResults.photos),
        map((photos) => this.photosSig.set(photos))
      )
      .subscribe();

    this.subscriptions.push(photosSubscription);
  }

  fetchVideos() {
    this.videosService
      .searchVideo('money', { per_page: 4 })
      .pipe(
        filter(
          (response): response is Videos =>
            'videos' in response && 'total_results' in response
        ),
        map(({ videos }) => this.videosSig.set(videos))
      )
      .subscribe(() => {
        console.log(this.videosSig());
      });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
