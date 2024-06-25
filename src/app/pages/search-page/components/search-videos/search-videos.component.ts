import {
  Component,
  effect,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';

import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Videos } from 'pexels';
import { ErrorTemplateComponent } from '../../../../shared/components/error-template/error-template.component';
import { LoadingTemplateComponent } from '../../../../shared/components/loading-template/loading-template.component';
import { VideoMiniatureComponent } from '../../../../shared/components/video-miniature/video-miniature.component';
import {
  resetPageSettings,
  updatePageSettings,
} from '../../../../shared/utils/pagination.utils';
import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { NoResultsComponent } from '../../../../shared/components/no-results/no-results.component';

@Component({
  selector: 'app-search-videos',
  standalone: true,
  imports: [
    MatPaginatorModule,
    VideoMiniatureComponent,
    LoadingTemplateComponent,
    ErrorTemplateComponent,
    NoResultsComponent,
  ],
  templateUrl: './search-videos.component.html',
  styleUrl: './search-videos.component.scss',
})
export class SearchVideosComponent {
  private authenticationService = inject(AuthenticationService);

  errorSig = input.required<string>({ alias: 'error' });
  videosWithTotalResultsSig = input.required<Videos | null>({
    alias: 'videos',
  });
  loading = input.required<boolean>();

  currentPageSig = signal<number>(0);
  pageSizeSig = signal<number>(6);

  paginationChange = output<PageEvent>();

  constructor() {
    effect(
      () => {
        resetPageSettings(this.pageSizeSig, this.currentPageSig, 6);
      },
      { allowSignalWrites: true }
    );
  }

  onPaginatorChange(event: PageEvent) {
    this.paginationChange.emit(event);
    updatePageSettings(event, this.pageSizeSig, this.currentPageSig);
  }
}
