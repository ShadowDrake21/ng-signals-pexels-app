import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CollectionsService } from '../../core/services/collections.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {
  delay,
  filter,
  forkJoin,
  map,
  Observable,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { CollectionMediaWidthTotalResults } from '../../shared/models/pexelEntities.models';
import { MatTabsModule } from '@angular/material/tabs';
import { PageEvent } from '@angular/material/paginator';
import { LoadingTemplateComponent } from '../../shared/components/loading-template/loading-template.component';
import { errorMessage } from '../../shared/contents/errors.contents';
import { SingleCollectionPhotosComponent } from './components/single-collection-photos/single-collection-photos.component';
import { SingleCollectionVideosComponent } from './components/single-collection-videos/single-collection-videos.component';

@Component({
  selector: 'app-single-collection',
  standalone: true,
  imports: [
    MatTabsModule,
    LoadingTemplateComponent,
    SingleCollectionPhotosComponent,
    SingleCollectionVideosComponent,
  ],
  templateUrl: './single-collection.component.html',
  styleUrl: './single-collection.component.scss',
})
export class SingleCollectionComponent implements OnInit, OnDestroy {
  private collectionsService = inject(CollectionsService);
  private route = inject(ActivatedRoute);

  collectionId$!: Observable<string | null>;

  loading: boolean = true;

  collectionPhotosSig = signal<CollectionMediaWidthTotalResults | null>(null);
  collectionPhotosErrorSig = signal<string>('');

  collectionVideosSig = signal<CollectionMediaWidthTotalResults | null>(null);
  collectionVideosErrorSig = signal<string>('');

  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.collectionId$ = this.route.paramMap.pipe(
      map((params: ParamMap) => params.get('id'))
    );

    this.fetchSingleCollection();
  }

  fetchSingleCollection() {
    const singleCollectionSubscription = this.collectionId$
      .pipe(
        filter((value) => !!value),
        map((id) => id as string),
        switchMap((id: string) =>
          forkJoin({
            photos: this.collectionsService.getCollectionMedia(
              id,
              { per_page: 15 },
              'photos'
            ),
            videos: this.collectionsService.getCollectionMedia(
              id,
              { per_page: 6 },
              'videos'
            ),
          }).pipe(
            delay(3000),
            tap(() => (this.loading = false))
          )
        )
      )
      .subscribe((response) => {
        console.log('response', response);
        this.collectionPhotosSig.set(response.photos);
        this.collectionVideosSig.set(response.videos);
      });

    this.subscriptions.push(singleCollectionSubscription);
  }

  onPaginatorChange(event: PageEvent, type: 'photos' | 'videos') {
    const paginatorChangeSubscription = this.collectionId$
      .pipe(
        filter((value) => !!value),
        map((id) => id as string),
        switchMap((id) =>
          this.collectionsService.getCollectionMedia(
            id,
            {
              page: event.pageIndex + 1,
              per_page: event.pageSize,
            },
            type
          )
        )
      )
      .subscribe((result) => {
        console.log('result', result);
        if (result) {
          if (type === 'photos' && 'media' in result) {
            this.collectionPhotosSig.update((prev) => result);
          } else {
            this.collectionPhotosErrorSig.set(errorMessage);
          }

          if (type === 'videos' && 'media' in result) {
            this.collectionVideosSig.update((prev) => result);
          } else {
            this.collectionVideosErrorSig.set(errorMessage);
          }
        }
      });

    this.subscriptions.push(paginatorChangeSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
