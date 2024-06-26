// angular stuff
import { Component, effect, input, output, signal } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Videos, Video } from 'pexels';
import { MatGridListModule } from '@angular/material/grid-list';

// components
import { VideoMiniatureComponent } from '../../../../shared/components/video-miniature/video-miniature.component';
import { ErrorTemplateComponent } from '../../../../shared/components/error-template/error-template.component';
import { LoadingTemplateComponent } from '../../../../shared/components/loading-template/loading-template.component';
import { NoResultsComponent } from '../../../../shared/components/no-results/no-results.component';

// models
import { CollectionMediaWidthTotalResults } from '../../../../shared/models/pexelEntities.model';

// utils
import { updatePageSettings } from '../../../../shared/utils/pagination.utils';

@Component({
  selector: 'app-single-collection-videos',
  standalone: true,
  imports: [
    VideoMiniatureComponent,
    ErrorTemplateComponent,
    LoadingTemplateComponent,
    MatPaginatorModule,
    MatGridListModule,
    NoResultsComponent,
  ],
  templateUrl: './single-collection-videos.component.html',
  styleUrl: './single-collection-videos.component.scss',
})
export class SingleCollectionVideosComponent {
  inputSig = input.required<CollectionMediaWidthTotalResults | null>({
    alias: 'videos',
  });

  photosTransformedSig = signal<Videos | null>(null);

  errorSig = input.required<string>({ alias: 'error' });
  currentPageSig = signal<number>(0);
  pageSizeSig = signal<number>(6);

  paginationChange = output<PageEvent>();

  constructor() {
    effect(
      () => {
        this.photosTransformedSig.set({
          ...this.inputSig(),
          videos: this.inputSig()?.media as Video[],
        } as Videos);
      },
      { allowSignalWrites: true }
    );
  }

  onPaginatorChange(event: PageEvent) {
    this.paginationChange.emit(event);
    updatePageSettings(event, this.pageSizeSig, this.currentPageSig);
  }
}
