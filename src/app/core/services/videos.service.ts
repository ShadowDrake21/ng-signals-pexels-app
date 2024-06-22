import { Injectable, Signal, inject } from '@angular/core';
import { PexelsService } from './pexels.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { PaginationParams, Videos, ErrorResponse, Video } from 'pexels';
import { from, map, catchError, of, Observable, throwError } from 'rxjs';

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

  getPopularVideos(
    params?: PaginationParams
  ): Observable<Videos | ErrorResponse> {
    return from(
      this.client.videos.popular({
        page: params?.page || 1,
        per_page: params?.per_page || 5,
      })
    ).pipe(
      map((response) => response as Videos),
      catchError((error) => of(error as ErrorResponse))
    );
  }

  getVideo(id: number): Observable<Video | ErrorResponse> {
    return from(
      this.client.videos.show({
        id,
      })
    ).pipe(
      map((response) => response as Video),
      catchError((error) => of(error as ErrorResponse))
    );
  }
}
