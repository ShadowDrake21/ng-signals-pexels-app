import {
  Component,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { Video } from 'pexels';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { VideoModalComponent } from './components/video-modal/video-modal.component';
import { getAppropriateVideo } from '../../utils/video.utils';
import { AuthenticationService } from '../../../core/authentication/authentication.service';

@Component({
  selector: 'app-video-miniature',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatDialogModule],
  templateUrl: './video-miniature.component.html',
  styleUrl: './video-miniature.component.scss',
})
export class VideoMiniatureComponent implements OnInit {
  private authenticationService = inject(AuthenticationService);
  readonly modal = inject(MatDialog);

  video = input.required<Video>();

  isLikeableSig = signal<boolean>(true);

  getAppropriateVideo = getAppropriateVideo;

  openModal() {
    this.modal.open(VideoModalComponent, {
      data: { item: this.video() },
    });
  }

  ngOnInit(): void {
    this.authenticationService.isUserAuth.subscribe((value) =>
      this.isLikeableSig.set(value)
    );
  }
}
