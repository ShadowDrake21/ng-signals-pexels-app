import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CollectionsService } from '../../core/services/collections.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {
  filter,
  forkJoin,
  map,
  Observable,
  Subscription,
  switchMap,
} from 'rxjs';
import { CollectionMediaWidthTotalResults } from '../../shared/models/pexelEntities.models';
import { JsonPipe } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-single-collection',
  standalone: true,
  imports: [JsonPipe, MatTabsModule, MatGridListModule, MatPaginatorModule],
  templateUrl: './single-collection.component.html',
  styleUrl: './single-collection.component.scss',
})
export class SingleCollectionComponent implements OnInit, OnDestroy {
  private collectionsService = inject(CollectionsService);
  private route = inject(ActivatedRoute);

  collectionId$!: Observable<string | null>;
  collectionPhotosSig = signal<CollectionMediaWidthTotalResults | null>(null);
  collectionVideosSig = signal<CollectionMediaWidthTotalResults | null>(null);

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
              { per_page: 10 },
              'photos'
            ),
            videos: this.collectionsService.getCollectionMedia(
              id,
              { per_page: 10 },
              'videos'
            ),
          })
        )
      )
      .subscribe((response) => console.log('response', response));

    this.subscriptions.push(singleCollectionSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
