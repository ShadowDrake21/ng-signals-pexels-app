import { Injectable, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PaginationParams, ErrorResponse } from 'pexels';
import { from, map, catchError, of } from 'rxjs';
import {
  CollectionsWithTotalResults,
  CollectionMediaWidthTotalResults,
} from '../../shared/models/pexelEntities.models';
import { PexelsService } from './pexels.service';

@Injectable({ providedIn: 'root' })
export class CollectionsService {
  private pexelsService = inject(PexelsService);

  client = this.pexelsService.getClient();

  getAllCollections(
    params?: PaginationParams
  ): Signal<ErrorResponse | CollectionsWithTotalResults | undefined> {
    return toSignal(
      from(
        this.client.collections.all({
          page: params?.page || 1,
          per_page: params?.per_page || 5,
        })
      ).pipe(
        map((response) => response as CollectionsWithTotalResults),
        catchError((error) => of(error as ErrorResponse))
      )
    );
  }

  getFeaturedCollections(
    params?: PaginationParams
  ): Signal<ErrorResponse | CollectionsWithTotalResults | undefined> {
    return toSignal(
      from(
        this.client.collections.featured({
          page: params?.page || 1,
          per_page: params?.per_page || 5,
        })
      ).pipe(
        map((response) => response as CollectionsWithTotalResults),
        catchError((error) => of(error as ErrorResponse))
      )
    );
  }

  getCollectionMedia(
    id: number,
    params?: PaginationParams,
    type: 'photos' | 'videos' = 'photos'
  ): Signal<ErrorResponse | CollectionMediaWidthTotalResults | undefined> {
    const searchParams = {
      id,
      page: params?.page || 1,
      per_page: params?.per_page || 5,
      type: type,
    };

    return toSignal(
      from(this.client.collections.media(searchParams)).pipe(
        map((response) => response as CollectionMediaWidthTotalResults),
        catchError((error) => of(error as ErrorResponse))
      )
    );
  }
}
