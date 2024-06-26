// angular stuff
import { Injectable, inject } from '@angular/core';
import { PaginationParams, Videos, Video } from 'pexels';
import { from, map, catchError, of, Observable, throwError } from 'rxjs';

// services
import { PexelsService } from './pexels.service';

@Injectable({ providedIn: 'root' })
export class VideosService {
  private pexelsService = inject(PexelsService);

  client = this.pexelsService.getClient();

  searchVideos(
    query: string,
    params?: PaginationParams
  ): Observable<Videos | null> {
    const searchParams = {
      query,
      page: params?.page || 1,
      per_page: params?.per_page || 5,
    };

    return from(this.client.videos.search(searchParams)).pipe(
      map((response) => response as Videos),
      catchError((error) => throwError(() => of(null)))
    );
  }

  getPopularVideos(params?: PaginationParams): Observable<Videos | null> {
    return from(
      this.client.videos.popular({
        page: params?.page || 1,
        per_page: params?.per_page || 5,
      })
    ).pipe(
      map((response) => response as Videos),
      catchError((error) => throwError(() => of(null)))
    );
  }

  getVideo(id: number): Observable<Video | null> {
    return from(
      this.client.videos.show({
        id,
      })
    ).pipe(
      map((response) => response as Video),
      catchError((error) => of(null))
    );
  }
}
