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
} from 'pexels';
import { PhotoMiniatureComponent } from '../../shared/components/photo-miniature/photo-miniature.component';
import { PhotosListComponent } from './components/photos-list/photos-list.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [PhotoMiniatureComponent, PhotosListComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit, OnDestroy {
  private photosService = inject(PhotosService);

  photosSig: WritableSignal<Photo[]> = signal([]);

  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.photosService
      .searchPhotos('girls')
      .pipe(
        filter(
          (response): response is PhotosWithTotalResults =>
            'photos' in response && 'total_results' in response
        ),
        map((photosWithResults) => photosWithResults.photos),
        map((photos) => this.photosSig.set(photos))
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
