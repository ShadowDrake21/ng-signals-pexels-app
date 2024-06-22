import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CollectionsService } from '../../core/services/collections.service';
import { MatCardModule } from '@angular/material/card';
import { ErrorResponse } from 'pexels';
import { map, delay, tap, catchError, of, Subscription } from 'rxjs';
import { errorMessage } from '../../shared/contents/errors.contents';
import { CollectionsWithTotalResults } from '../../shared/models/pexelEntities.models';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-collections',
  standalone: true,
  imports: [NgIf, MatCardModule],
  templateUrl: './collections.component.html',
  styleUrl: './collections.component.scss',
})
export class CollectionsComponent implements OnInit, OnDestroy {
  private collectionsService = inject(CollectionsService);

  collectionsWithTotalResultsSig = signal<CollectionsWithTotalResults | null>(
    null
  );
  errorSig = signal<string>('');

  currentPageSig = signal<number>(0);
  pageSizeSig = signal<number>(6);

  loading: boolean = true;

  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    const collectionSubscription = this.collectionsService
      .getFeaturedCollections({ page: 0 })
      .pipe(
        map((response) => {
          if (
            response &&
            'collections' in response &&
            'total_results' in response
          ) {
            return { type: 'success', data: response };
          } else {
            throw response;
          }
        }),
        map((result) => {
          if (result.type === 'success') {
            this.collectionsWithTotalResultsSig.set(result.data);
          }
        }),
        delay(3000),
        tap(() => {
          this.loading = false;
          this.pageSizeSig() !== 6 && this.pageSizeSig.update((prev) => 6);
          this.currentPageSig() !== 0 &&
            this.currentPageSig.update((prev) => 0);
        }),
        catchError((error: ErrorResponse) => {
          this.errorSig.set(errorMessage);
          return of();
        })
      )
      .subscribe();

    this.subscriptions.push(collectionSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
