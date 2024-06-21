import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PhotosService } from '../../../../core/services/photos.service';
import {
  catchError,
  debounceTime,
  delay,
  distinctUntilChanged,
  filter,
  map,
  of,
  Subject,
  Subscription,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { PhotosWithTotalResults } from 'pexels';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PhotoMiniatureComponent } from '../../../../shared/components/photo-miniature/photo-miniature.component';
import { LoadingTemplateComponent } from '../../../../shared/components/loading-template/loading-template.component';
import { ErrorTemplateComponent } from '../../../../shared/components/error-template/error-template.component';

@Component({
  selector: 'app-search-photos',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    PhotoMiniatureComponent,
    LoadingTemplateComponent,
    ErrorTemplateComponent,
  ],
  templateUrl: './search-photos.component.html',
  styleUrl: './search-photos.component.scss',
})
export class SearchPhotosComponent implements OnInit, OnDestroy {
  private photosService = inject(PhotosService);

  private search$$ = new Subject<string>();
  private destroy$$ = new Subject<void>();

  searchTerm = '';
  currentPageSig = signal<number>(0);
  pageSizeSig = signal<number>(10);

  photosWithTotalResultsSig = signal<PhotosWithTotalResults | null>(null);
  errorSig = signal<string>('');

  loading: boolean = false;

  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.search$$
      .pipe(
        tap((value) => {
          this.loading = !!value.length;
        }),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((term) => {
          if (!term.length) {
            this.photosWithTotalResultsSig.set(null);
            return of(null);
          }
          return this.photosService.searchPhotos(term).pipe(
            catchError((error) => {
              console.log('error switchmap');
              this.errorSig.set('Something went wrong! Try one more time!');
              this.loading = false;
              return of(null);
            })
          );
        }),
        tap(() => {
          this.pageSizeSig() !== 10 && this.pageSizeSig.update((prev) => 10);
          this.currentPageSig() !== 0 &&
            this.currentPageSig.update((prev) => 0);
        }),
        delay(500),
        takeUntil(this.destroy$$)
      )
      .subscribe((foundPhotos) => {
        this.loading = false;
        if (foundPhotos && 'photos' in foundPhotos) {
          this.photosWithTotalResultsSig.set(foundPhotos);
          this.errorSig.set('');
        } else {
          this.photosWithTotalResultsSig.set(null);
        }
      });
  }

  handleSearchInputChange() {
    this.search$$.next(this.searchTerm);
  }

  onClearInput() {
    this.searchTerm = '';
    this.handleSearchInputChange();
  }

  onPaginatorChange(event: PageEvent) {
    const paginatorChangeSubscription = this.photosService
      .searchPhotos(this.searchTerm, {
        page: event.pageIndex + 1,
        per_page: event.pageSize,
      })
      .pipe(
        tap(() => {
          this.pageSizeSig.update((prev) => event.pageSize);
          this.currentPageSig.update((prev) => event.pageIndex);
        })
      )
      .subscribe((result) => {
        if (result && 'photos' in result) {
          this.photosWithTotalResultsSig.update((prev) => result);
        } else {
          this.errorSig.set('Something went wrong! Try one more time!');
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
