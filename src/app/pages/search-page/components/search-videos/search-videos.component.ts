import { Component, effect, input, output, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Videos } from 'pexels';
import { ErrorTemplateComponent } from '../../../../shared/components/error-template/error-template.component';
import { LoadingTemplateComponent } from '../../../../shared/components/loading-template/loading-template.component';
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

  currentPageSig = signal<number>(0);
  pageSizeSig = signal<number>(6);

  paginationChange = output<PageEvent>();

  constructor() {
    effect(
      () => {
        this.resetSettings();
      },
      { allowSignalWrites: true }
    );
  }

  onPaginatorChange(event: PageEvent) {
    this.paginationChange.emit(event);
    this.pageSizeSig.update((prev) => event.pageSize);
    this.currentPageSig.update((prev) => event.pageIndex);
  }
  resetSettings() {
    this.pageSizeSig() !== 6 && this.pageSizeSig.update((prev) => 6);
    this.currentPageSig() !== 0 && this.currentPageSig.update((prev) => 0);
  }
}
