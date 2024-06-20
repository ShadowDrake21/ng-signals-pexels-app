import { Component, Input, input } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { Video } from 'pexels';
import { VideoMiniatureComponent } from '../../../../shared/components/video-miniature/video-miniature.component';

@Component({
  selector: 'app-videos-list',
  standalone: true,
  imports: [MatGridListModule, VideoMiniatureComponent],
  templateUrl: './videos-list.component.html',
  styleUrl: './videos-list.component.scss',
})
export class VideosListComponent {
  videos = input.required<Video[]>();
}
