import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { VideosService } from '../../core/services/videos.service';
import { catchError, delay, map, of, Subscription, tap } from 'rxjs';
import { ErrorResponse, Videos } from 'pexels';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ErrorTemplateComponent } from '../../shared/components/error-template/error-template.component';
import { LoadingTemplateComponent } from '../../shared/components/loading-template/loading-template.component';
import { VideoMiniatureComponent } from '../../shared/components/video-miniature/video-miniature.component';
import { errorMessage } from '../../shared/contents/errors.contents';
import {
  resetPageSettings,
  updatePageSettings,
} from '../../shared/utils/pagination.utils';
import { AuthenticationService } from '../../core/authentication/authentication.service';

@Component({
  selector: 'app-popular-videos-page',
  standalone: true,
  imports: [
    MatPaginatorModule,
    VideoMiniatureComponent,
    LoadingTemplateComponent,
    ErrorTemplateComponent,
  ],
  templateUrl: './popular-videos-page.component.html',
  styleUrl: './popular-videos-page.component.scss',
})
export class PopularVideosPageComponent implements OnInit, OnDestroy {
  private authenticationService = inject(AuthenticationService);
  private videosService = inject(VideosService);

  loading: boolean = true;
  videosWithTotalResultsSig = signal<Videos | null>(null);
  errorSig = signal<string>('');

  currentPageSig = signal<number>(0);
  pageSizeSig = signal<number>(6);

  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.fetchPopularVideos();
  }

  fetchPopularVideos() {
    const fetchPopularVideosSubscription = this.videosService
      .getPopularVideos({ per_page: 6 })
      .pipe(
        map((response) => {
          if (response && 'videos' in response && 'total_results' in response) {
            return { type: 'success', data: response };
          } else {
            throw response;
          }
        }),
        map((result) => {
          if (result.type === 'success') {
            this.videosWithTotalResultsSig.set(result.data);
          }
        }),
        delay(3000),
        tap(() => {
          this.loading = false;
          resetPageSettings(this.pageSizeSig, this.currentPageSig, 6);
        }),
        catchError((error: ErrorResponse) => {
          this.errorSig.set(errorMessage);
          return of();
        })
      )
      .subscribe();

    this.subscriptions.push(fetchPopularVideosSubscription);
  }

  onPaginatorChange(event: PageEvent) {
    const paginatorChangeSubscription = this.videosService
      .getPopularVideos({
        page: event.pageIndex + 1,
        per_page: event.pageSize,
      })
      .pipe(
        tap(() => {
          updatePageSettings(event, this.pageSizeSig, this.currentPageSig);
        })
      )
      .subscribe((result) => {
        if (result && 'videos' in result) {
          this.videosWithTotalResultsSig.update((prev) => result);
        } else {
          this.errorSig.set(errorMessage);
        }
      });

    this.subscriptions.push(paginatorChangeSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
