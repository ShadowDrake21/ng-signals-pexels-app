import { Routes } from '@angular/router';
import { AuthenticationPageComponent } from './pages/authentication-page/authentication-page.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: 'authentication', component: AuthenticationPageComponent },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home-page/home-page.component').then(
        (c) => c.HomePageComponent
      ),
  },
  {
    path: 'search-photos',
    loadComponent: () =>
      import('./pages/search-photos-page/search-photos-page.component').then(
        (c) => c.SearchPhotosPageComponent
      ),
  },
  // single photo and single video in modals ?
  {
    path: 'search-videos',
    loadComponent: () =>
      import('./pages/search-videos-page/search-videos-page.component').then(
        (c) => c.SearchVideosPageComponent
      ),
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./pages/search-page/search-page.component').then(
        (c) => c.SearchPageComponent
      ),
  },
  {
    path: 'popular-videos',
    loadComponent: () =>
      import('./pages/popular-videos-page/popular-videos-page.component').then(
        (c) => c.PopularVideosPageComponent
      ),
  },
  {
    path: 'collections',
    loadComponent: () =>
      import('./pages/collections/collections.component').then(
        (c) => c.CollectionsComponent
      ),

    children: [
      {
        path: ':id',
        loadChildren: () =>
          import('./pages/single-collection/single-collection.component').then(
            (c) => c.SingleCollectionComponent
          ),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found-page/not-found-page.component').then(
        (c) => c.NotFoundPageComponent
      ),
  },
];
