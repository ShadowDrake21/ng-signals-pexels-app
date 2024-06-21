import {
  Component,
  inject,
  Input,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
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
} from 'rxjs';
import { PhotosService } from '../../../../core/services/photos.service';
import { VideosService } from '../../../../core/services/videos.service';
import { ErrorTemplateComponent } from '../../../../shared/components/error-template/error-template.component';
import { LoadingTemplateComponent } from '../../../../shared/components/loading-template/loading-template.component';
import { PhotoMiniatureComponent } from '../../../../shared/components/photo-miniature/photo-miniature.component';
import { VideoMiniatureComponent } from '../../../../shared/components/video-miniature/video-miniature.component';

@Component({
  selector: 'app-search-videos',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    VideoMiniatureComponent,
    LoadingTemplateComponent,
    ErrorTemplateComponent,
  ],
  templateUrl: './search-videos.component.html',
  styleUrl: './search-videos.component.scss',
})
export class SearchVideosComponent {
  errorSig = input.required<string>({ alias: 'error' });
  videosWithTotalResultsSig = input.required<Videos | null>({
    alias: 'videos',
  });
  loading = input.required<boolean>();

  // pagination manipulations !!!!

  paginationChange = output<PageEvent>();
  onPaginatorChange(event: PageEvent) {
    this.paginationChange.emit(event);
    // const paginatorChangeSubscription = this.photosService
    //   .searchPhotos(this.searchTerm, {
    //     page: event.pageIndex + 1,
    //     per_page: event.pageSize,
    //   })
    //   .pipe(
    //     tap(() => {
    //       this.pageSizeSig.update((prev) => event.pageSize);
    //       this.currentPageSig.update((prev) => event.pageIndex);
    //     })
    //   )
    //   .subscribe((result) => {
    //     if (result && 'photos' in result) {
    //       this.photosWithTotalResultsSig.update((prev) => result);
    //     } else {
    //       this.errorSig.set('Something went wrong! Try one more time!');
    //     }
    //   });

    // this.subscriptions.push(paginatorChangeSubscription);
  }
}
// implements OnInit, OnDestroy {
//   private videosService = inject(VideosService);

//   private search$$ = new Subject<string>();
//   private destroy$$ = new Subject<void>();

//   searchTerm = '';
//   currentPageSig = signal<number>(0);
//   pageSizeSig = signal<number>(6);

//   videosWithTotalResultsSig = signal<Videos | null>(null);
//   errorSig = signal<string>('');

//   loading: boolean = false;

//   private subscriptions: Subscription[] = [];

//   ngOnInit(): void {
//     this.search$$
//       .pipe(
//         tap((value) => {
//           this.loading = !!value.length;
//         }),
//         debounceTime(500),
//         distinctUntilChanged(),
//         switchMap((term) => {
//           if (!term.length) {
//             this.videosWithTotalResultsSig.set(null);
//             return of(null);
//           }
//           return this.videosService.searchVideos(term, { per_page: 6 }).pipe(
//             catchError((error) => {
//               this.errorSig.set('Something went wrong! Try one more time!');
//               this.loading = false;
//               return of(null);
//             })
//           );
//         }),
//         tap(() => {
//           this.pageSizeSig() !== 6 && this.pageSizeSig.update((prev) => 6);
//           this.currentPageSig() !== 0 &&
//             this.currentPageSig.update((prev) => 0);
//         }),
//         delay(500),
//         takeUntil(this.destroy$$)
//       )
//       .subscribe((foundVideos) => {
//         this.loading = false;
//         if (foundVideos && 'videos' in foundVideos) {
//           this.videosWithTotalResultsSig.set(foundVideos);
//           this.errorSig.set('');
//         } else {
//           this.videosWithTotalResultsSig.set(null);
//         }
//       });
//   }

//   handleSearchInputChange() {
//     this.search$$.next(this.searchTerm);
//   }

//   onClearInput() {
//     this.searchTerm = '';
//     this.handleSearchInputChange();
//   }

//   onPaginatorChange(event: PageEvent) {
//     const paginatorChangeSubscription = this.videosService
//       .searchVideos(this.searchTerm, {
//         page: event.pageIndex + 1,
//         per_page: event.pageSize,
//       })
//       .pipe(
//         tap(() => {
//           this.pageSizeSig.update((prev) => event.pageSize);
//           this.currentPageSig.update((prev) => event.pageIndex);
//         })
//       )
//       .subscribe((result) => {
//         if (result && 'videos' in result) {
//           this.videosWithTotalResultsSig.update((prev) => result);
//         } else {
//           this.errorSig.set('Something went wrong! Try one more time!');
//         }
//       });

//     this.subscriptions.push(paginatorChangeSubscription);
//   }

//   ngOnDestroy(): void {
//     this.destroy$$.next();
//     this.destroy$$.complete();

//     this.subscriptions.forEach((subscription) => subscription.unsubscribe());
//   }
// }
