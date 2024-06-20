import { Component, effect, inject, input } from '@angular/core';
import { Video } from 'pexels';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { VideoModalComponent } from './components/video-modal/video-modal.component';
import { getAppropriateVideo } from '../../utils/video.utils';

@Component({
  selector: 'app-video-miniature',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatDialogModule],
  templateUrl: './video-miniature.component.html',
  styleUrl: './video-miniature.component.scss',
})
export class VideoMiniatureComponent {
  readonly modal = inject(MatDialog);
  video = input.required<Video>();

  getAppropriateVideo = getAppropriateVideo;

  openModal() {
    const modalRef = this.modal.open(VideoModalComponent, {
      data: { item: this.video() },
    });

    modalRef.afterClosed().subscribe((result) => {
      console.log(`Modal result: ${result}`);
    });
  }
}
