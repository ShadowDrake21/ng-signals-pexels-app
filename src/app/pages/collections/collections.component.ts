import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CollectionsService } from '../../core/services/collections.service';
import { MatCardModule } from '@angular/material/card';
import { ErrorResponse } from 'pexels';
import { map, delay, tap, catchError, of, Subscription } from 'rxjs';
import { errorMessage } from '../../shared/contents/errors.contents';
import { CollectionsWithTotalResults } from '../../shared/models/pexelEntities.model';
import { NgIf } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ErrorTemplateComponent } from '../../shared/components/error-template/error-template.component';
import { LoadingTemplateComponent } from '../../shared/components/loading-template/loading-template.component';

@Component({
  selector: 'app-collections',
  standalone: true,
  imports: [
    NgIf,
    MatCardModule,
    RouterLink,
    RouterOutlet,
    MatPaginatorModule,
    LoadingTemplateComponent,
    ErrorTemplateComponent,
  ],
  templateUrl: './collections.component.html',
  styleUrl: './collections.component.scss',
})
export class CollectionsComponent implements OnInit, OnDestroy {
  private collectionsService = inject(CollectionsService);

  loading: boolean = true;

  collectionsWithTotalResultsSig = signal<CollectionsWithTotalResults | null>(
    null
  );
  errorSig = signal<string>('');

  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    const collectionSubscription = this.collectionsService
      .getFeaturedCollections({ per_page: 9 })
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
        delay(2000),
        tap(() => {
          this.loading = false;
        }),
        catchError((error: ErrorResponse) => {
          this.errorSig.set(errorMessage);
          return of();
        })
      )
      .subscribe();

    this.subscriptions.push(collectionSubscription);
  }

  onPaginatorChange(event: PageEvent) {
    const paginatorChangeSubscription = this.collectionsService
      .getFeaturedCollections({
        page: event.pageIndex + 1,
        per_page: event.pageSize,
      })
      .subscribe((result) => {
        if (result && 'collections' in result) {
          this.collectionsWithTotalResultsSig.update((prev) => result);
        } else {
          this.errorSig.set(errorMessage);
        }
      });

    this.subscriptions.push(paginatorChangeSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
