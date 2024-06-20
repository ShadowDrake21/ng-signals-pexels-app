import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { SearchPhotosComponent } from './components/search-photos/search-photos.component';
import { SearchVideosComponent } from './components/search-videos/search-videos.component';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [MatTabsModule, SearchPhotosComponent, SearchVideosComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
})
export class SearchPageComponent {}
