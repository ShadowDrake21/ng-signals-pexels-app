import {
  Component,
  effect,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
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
export class SearchPhotosComponent implements OnInit {
  photosWithTotalResultsSig = input.required<PhotosWithTotalResults | null>({
    alias: 'photos',
  });
  errorSig = input.required<string>({ alias: 'error' });
  loading = input.required<boolean>();
  currentPageSig = signal<number>(0);
  pageSizeSig = signal<number>(10);

  constructor() {
    effect(
      () => {
        this.resetSettings();
      },
      { allowSignalWrites: true }
    );
  }

  ngOnInit(): void {}

  paginationChange = output<PageEvent>();
  onPaginatorChange(event: PageEvent) {
    this.paginationChange.emit(event);
    this.pageSizeSig.update((prev) => event.pageSize);
    this.currentPageSig.update((prev) => event.pageIndex);
  }

  resetSettings() {
    this.pageSizeSig() !== 10 && this.pageSizeSig.update((prev) => 10);
    this.currentPageSig() !== 0 && this.currentPageSig.update((prev) => 0);
  }
}
