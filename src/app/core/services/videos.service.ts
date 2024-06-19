import { Injectable, Signal, inject } from '@angular/core';
import { PexelsService } from './pexels.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { PaginationParams, Videos, ErrorResponse, Video } from 'pexels';
import { from, map, catchError, of, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VideosService {
  private pexelsService = inject(PexelsService);

  client = this.pexelsService.getClient();

  searchVideo(
    query: string,
    params?: PaginationParams
  ): Observable<Videos | ErrorResponse> {
    const searchParams = {
      query,
      page: params?.page || 1,
      per_page: params?.per_page || 5,
    };

    return from(this.client.videos.search(searchParams)).pipe(
      map((response) => response as Videos),
      catchError((error) => of(error as ErrorResponse))
    );
  }

  getPopularVideos(
    params?: PaginationParams
  ): Signal<Videos | ErrorResponse | undefined> {
    return toSignal(
      from(
        this.client.videos.popular({
          page: params?.page || 1, //???
          per_page: params?.per_page || 5,
        })
      ).pipe(
        map((response) => response as Videos),
        catchError((error) => of(error as ErrorResponse))
      )
    );
  }

  getVideo(id: number): Signal<Video | ErrorResponse | undefined> {
    return toSignal(
      from(
        this.client.videos.show({
          id,
        })
      ).pipe(
        map((response) => response as Video),
        catchError((error) => of(error as ErrorResponse))
      )
    );
  }
}
