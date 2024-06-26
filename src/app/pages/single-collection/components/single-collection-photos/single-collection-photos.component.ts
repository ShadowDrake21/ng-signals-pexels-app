// angular stuff
import { Component, effect, input, output, signal } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Photo, PhotosWithTotalResults } from 'pexels';

// components
import { ErrorTemplateComponent } from '../../../../shared/components/error-template/error-template.component';
import { LoadingTemplateComponent } from '../../../../shared/components/loading-template/loading-template.component';
import { PhotoMiniatureComponent } from '../../../../shared/components/photo-miniature/photo-miniature.component';
import { NoResultsComponent } from '../../../../shared/components/no-results/no-results.component';

// models
import { CollectionMediaWidthTotalResults } from '../../../../shared/models/pexelEntities.model';

// utils
import { updatePageSettings } from '../../../../shared/utils/pagination.utils';

@Component({
  selector: 'app-single-collection-photos',
  standalone: true,
  imports: [
    PhotoMiniatureComponent,
    ErrorTemplateComponent,
    LoadingTemplateComponent,
    MatPaginatorModule,
    NoResultsComponent,
  ],
  templateUrl: './single-collection-photos.component.html',
  styleUrl: './single-collection-photos.component.scss',
})
export class SingleCollectionPhotosComponent {
  inputSig = input.required<CollectionMediaWidthTotalResults | null>({
    alias: 'photos',
  });

  photosTransformedSig = signal<PhotosWithTotalResults | null>(null);

  errorSig = input.required<string>({ alias: 'error' });
  currentPageSig = signal<number>(0);
  pageSizeSig = signal<number>(15);

  paginationChange = output<PageEvent>();

  constructor() {
    effect(
      () => {
        this.photosTransformedSig.set({
          ...this.inputSig(),
          photos: this.inputSig()?.media as Photo[],
        } as PhotosWithTotalResults);
      },
      { allowSignalWrites: true }
    );
  }

  onPaginatorChange(event: PageEvent) {
    this.paginationChange.emit(event);

    updatePageSettings(event, this.pageSizeSig, this.currentPageSig);
  }
}
