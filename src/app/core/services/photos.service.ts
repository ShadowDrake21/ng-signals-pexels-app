import { inject, Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  PaginationParams,
  ErrorResponse,
  PhotosWithTotalResults,
  Photo,
  Photos,
} from 'pexels';
import { from, map, catchError, of, Observable } from 'rxjs';
import { PexelsService } from './pexels.service';

@Injectable({ providedIn: 'root' })
export class PhotosService {
  private pexelsService = inject(PexelsService);

  client = this.pexelsService.getClient();

  searchPhotos(
    query: string,
    params?: PaginationParams
  ): Observable<PhotosWithTotalResults | ErrorResponse> {
    const searchParams = {
      query,
      page: params?.page || 1,
      per_page: params?.per_page || 10,
    };

    return from(this.client.photos.search(searchParams)).pipe(
      map((response) => response as PhotosWithTotalResults),
      catchError((error) => {
        return of(error as ErrorResponse);
      })
    );
  }

  getPhoto(id: number): Signal<ErrorResponse | Photo | undefined> {
    return toSignal(
      from(this.client.photos.show({ id })).pipe(
        map((response) => response as Photo),
        catchError((error) => of(error as ErrorResponse))
      )
    );
  }

  getRandomPhoto(): Observable<Photo | ErrorResponse> {
    return from(this.client.photos.random()).pipe(
      map((response) => response as Photo),
      catchError((error) => of(error as ErrorResponse))
    );
  }

  getCuratedPhotos(
    params?: PaginationParams
  ): Observable<Photos | ErrorResponse> {
    return from(
      this.client.photos.curated({
        page: params?.page || 1,
        per_page: params?.per_page || 10,
      })
    ).pipe(
      map((response) => response as Photos),
      catchError((error) => of(error as ErrorResponse))
    );
  }
}
