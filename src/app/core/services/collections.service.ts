import { Injectable, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PaginationParams, ErrorResponse } from 'pexels';
import { from, map, catchError, of, Observable } from 'rxjs';
import {
  CollectionsWithTotalResults,
  CollectionMediaWidthTotalResults,
} from '../../shared/models/pexelEntities.model';
import { PexelsService } from './pexels.service';

@Injectable({ providedIn: 'root' })
export class CollectionsService {
  private pexelsService = inject(PexelsService);

  getFeaturedCollections(
    params?: PaginationParams
  ): Observable<CollectionsWithTotalResults | null> {
    return from(
      this.pexelsService.getClient().collections.featured({
        page: params?.page || 1,
        per_page: params?.per_page || 5,
      })
    ).pipe(
      map((response) => response as CollectionsWithTotalResults),
      catchError((error) => of(null))
    );
  }

  getCollectionMedia(
    id: string,
    params?: PaginationParams,
    type: 'photos' | 'videos' = 'photos'
  ): Observable<CollectionMediaWidthTotalResults | null> {
    const searchParams = {
      id,
      page: params?.page || 1,
      per_page: params?.per_page || 5,
      type: type,
    };

    return from(
      this.pexelsService.getClient().collections.media(searchParams)
    ).pipe(
      map((response) => response as CollectionMediaWidthTotalResults),
      catchError((error) => of(null))
    );
  }
}
