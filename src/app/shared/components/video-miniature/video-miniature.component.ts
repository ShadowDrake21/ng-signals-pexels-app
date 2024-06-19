import { Component, effect, input } from '@angular/core';
import { Video } from 'pexels';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-video-miniature',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './video-miniature.component.html',
  styleUrl: './video-miniature.component.scss',
})
export class VideoMiniatureComponent {
  video = input.required<Video>();

  ourVideo!: Video;

  getAppropriateVideo() {
    console.log('video', this.video());
    const foundVideo = this.video().video_files.find(
      (file) => file.quality === 'sd'
    );

    if (!foundVideo) {
      return (
        this.video().video_files.find((file) => file.quality === 'hls') ||
        this.video().video_files.find((file) => file.quality === 'hd')
      );
    }

    return foundVideo;
  }
}
