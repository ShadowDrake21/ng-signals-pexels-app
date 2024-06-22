import {
  Component,
  effect,
  inject,
  OnDestroy,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { SearchPhotosComponent } from './components/search-photos/search-photos.component';
import { SearchVideosComponent } from './components/search-videos/search-videos.component';
import { PageEvent } from '@angular/material/paginator';
import { PhotosWithTotalResults, Videos } from 'pexels';
import {
  Subject,
  Subscription,
  tap,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  of,
  catchError,
  delay,
  takeUntil,
  Observable,
} from 'rxjs';
import { VideosService } from '../../core/services/videos.service';
import { PhotosService } from '../../core/services/photos.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [
    MatTabsModule,
    SearchPhotosComponent,
    SearchVideosComponent,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatIconModule,
  ],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
})
export class SearchPageComponent implements OnInit, OnDestroy {
  private photosService = inject(PhotosService);
  private videosService = inject(VideosService);

  private search$$ = new Subject<string>();
  private destroy$$ = new Subject<void>();

  typeNumberSig = signal<number>(0);
  typeSig = signal<'photos' | 'videos'>('photos');

  searchTerm = '';

  photosWithTotalResultsSig = signal<PhotosWithTotalResults | null>(null);
  videosWithTotalResultsSig = signal<Videos | null>(null);

  errorPhotosSig = signal<string>('');
  errorVideosSig = signal<string>('');
  private errorMessage: string = 'Something went wrong! Try one more time!';

  loadingPhotos: boolean = false;
  loadingVideos: boolean = false;

  private subscriptions: Subscription[] = [];

  constructor() {
    effect(
      () => {
        this.syncTypeSignals();
        this.resetResultSignals();
        this.searchTerm = '';
      },
      { allowSignalWrites: true }
    );
  }

  syncTypeSignals() {
    this.typeNumberSig() === 0
      ? this.typeSig.set('photos')
      : this.typeSig.set('videos');

    console.log('typesig', this.typeSig());
  }

  ngOnInit(): void {
    this.startSearch();
  }

  startSearch() {
    this.search$$
      .pipe(
        tap((value) => {
          if (this.typeSig() === 'photos') {
            this.loadingPhotos = !!value.length;
          } else {
            this.loadingVideos = !!value.length;
          }
        }),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((term) => {
          if (!term.length) {
            this.typeSig() === 'photos'
              ? this.photosWithTotalResultsSig.set(null)
              : this.videosWithTotalResultsSig.set(null);
            return of(null);
          }
          if (this.typeSig() === 'photos') {
            return this.photosService
              .searchPhotos(term)
              .pipe(catchError((error) => this.catchErrorInSearch()));
          } else {
            return this.videosService
              .searchVideos(term, { per_page: 6 })
              .pipe(catchError((error) => this.catchErrorInSearch()));
          }
        }),

        delay(500),
        takeUntil(this.destroy$$)
      )
      .subscribe((foundItems) => {
        this.setLoadingState(false);
        if (foundItems) {
          if ('photos' in foundItems) {
            this.photosWithTotalResultsSig.set(foundItems);

            this.errorPhotosSig.set('');
          } else if ('videos' in foundItems) {
            this.videosWithTotalResultsSig.set(foundItems);
            this.errorVideosSig.set('');
          }
        } else {
          this.resetResultSignals();
        }
      });
  }

  private setLoadingState(state: boolean) {
    if (this.typeSig() === 'photos') {
      this.loadingPhotos = state;
    } else {
      this.loadingVideos = state;
    }
  }

  catchErrorInSearch(): Observable<null> {
    this.setLoadingState(false);
    if (this.typeSig() === 'photos') {
      this.errorPhotosSig.set(this.errorMessage);
    } else {
      this.errorVideosSig.set(this.errorMessage);
    }

    return of(null);
  }

  handleSearchInputChange() {
    this.search$$.next(this.searchTerm);
  }

  private resetResultSignals() {
    this.photosWithTotalResultsSig.set(null);
    this.videosWithTotalResultsSig.set(null);
  }

  onClearInput() {
    this.searchTerm = '';
    this.handleSearchInputChange();
  }

  onPaginatorChange(event: PageEvent) {
    const service =
      this.typeSig() === 'photos' ? this.photosService : this.videosService;
    const updatedSignal =
      this.typeSig() === 'photos'
        ? this.photosWithTotalResultsSig
        : this.videosWithTotalResultsSig;

    this.handlePaginatorChange(event, service, updatedSignal, this.typeSig());
  }

  handlePaginatorChange(
    event: PageEvent,
    service: any,
    updatedSignal: WritableSignal<any>,
    type: 'photos' | 'videos'
  ) {
    const searchModule = type === 'photos' ? 'searchPhotos' : 'searchVideos';
    const searchParameters = {
      page: event.pageIndex + 1,
      per_page: event.pageSize,
    };

    const paginatorChangeSubscription = service[searchModule](
      this.searchTerm,
      searchParameters
    ).subscribe((result: any) => {
      if (
        result &&
        (type === 'photos' ? 'photos' in result : 'videos' in result)
      ) {
        updatedSignal.update(() => result);
      } else {
        if (this.typeSig() === 'photos') {
          this.errorPhotosSig.set(this.errorMessage);
        } else {
          this.errorVideosSig.set(this.errorMessage);
        }
      }
    });
    this.subscriptions.push(paginatorChangeSubscription);
  }

  ngOnDestroy(): void {
    this.destroy$$.next();
    this.destroy$$.complete();

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
