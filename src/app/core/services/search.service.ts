import { inject, Injectable } from '@angular/core';
import { PhotosService } from './photos.service';
import { VideosService } from './videos.service';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private photosService = inject(PhotosService);
  private videosService = inject(VideosService);
}
