import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Video } from 'pexels';
import { getAppropriateVideo } from '../../../../utils/video.utils';
import { DurationPipe } from '../../../../pipes/duration.pipe';

@Component({
  selector: 'app-video-modal',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, DurationPipe],
  templateUrl: './video-modal.component.html',
  styleUrl: './video-modal.component.scss',
})
export class VideoModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { item: Video }) {}

  getAppropriateVideo = getAppropriateVideo;
}
