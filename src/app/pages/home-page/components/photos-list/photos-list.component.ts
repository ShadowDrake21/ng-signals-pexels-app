// angular stuff
import { Component, input } from '@angular/core';
import { Photo } from 'pexels';

// components
import { PhotoMiniatureComponent } from '../../../../shared/components/photo-miniature/photo-miniature.component';

@Component({
  selector: 'app-photos-list',
  standalone: true,
  imports: [PhotoMiniatureComponent],
  templateUrl: './photos-list.component.html',
  styleUrl: './photos-list.component.scss',
})
export class PhotosListComponent {
  photos = input.required<Photo[]>();
}
