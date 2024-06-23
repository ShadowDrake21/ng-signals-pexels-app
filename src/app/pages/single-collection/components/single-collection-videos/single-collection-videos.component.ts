import { Component, effect, input, output, signal } from '@angular/core';
import { VideoMiniatureComponent } from '../../../../shared/components/video-miniature/video-miniature.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ErrorTemplateComponent } from '../../../../shared/components/error-template/error-template.component';
import { LoadingTemplateComponent } from '../../../../shared/components/loading-template/loading-template.component';
import { Photo, Videos, Video } from 'pexels';
import { CollectionMediaWidthTotalResults } from '../../../../shared/models/pexelEntities.models';
import { MatGridListModule } from '@angular/material/grid-list';
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
