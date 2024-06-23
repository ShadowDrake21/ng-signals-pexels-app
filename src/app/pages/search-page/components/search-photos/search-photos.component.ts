import { Component, effect, input, output, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PhotosWithTotalResults } from 'pexels';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PhotoMiniatureComponent } from '../../../../shared/components/photo-miniature/photo-miniature.component';
import { LoadingTemplateComponent } from '../../../../shared/components/loading-template/loading-template.component';
import { ErrorTemplateComponent } from '../../../../shared/components/error-template/error-template.component';
import {
  resetPageSettings,
  updatePageSettings,
} from '../../../../shared/utils/pagination.utils';

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
export class SearchPhotosComponent {
  photosWithTotalResultsSig = input.required<PhotosWithTotalResults | null>({
    alias: 'photos',
  });

  errorSig = input.required<string>({ alias: 'error' });
  loading = input.required<boolean>();
  currentPageSig = signal<number>(0);
  pageSizeSig = signal<number>(10);

  paginationChange = output<PageEvent>();

  constructor() {
    effect(
      () => {
        resetPageSettings(this.pageSizeSig, this.currentPageSig, 10);
      },
      { allowSignalWrites: true }
    );
  }

  onPaginatorChange(event: PageEvent) {
    this.paginationChange.emit(event);
    updatePageSettings(event, this.pageSizeSig, this.currentPageSig);
  }
}
