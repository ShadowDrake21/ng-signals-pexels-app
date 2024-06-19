import { Component, input } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { Photo } from 'pexels';
import { PhotoMiniatureComponent } from '../../../../shared/components/photo-miniature/photo-miniature.component';

@Component({
  selector: 'app-photos-list',
  standalone: true,
  imports: [MatGridListModule, PhotoMiniatureComponent],
  templateUrl: './photos-list.component.html',
  styleUrl: './photos-list.component.scss',
})
export class PhotosListComponent {
  photos = input.required<Photo[]>();
}
