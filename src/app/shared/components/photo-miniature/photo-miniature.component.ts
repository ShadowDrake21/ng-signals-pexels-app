import { JsonPipe, NgOptimizedImage } from '@angular/common';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Photo } from 'pexels';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PhotoModalComponent } from './components/photo-modal/photo-modal.component';
import { AuthenticationService } from '../../../core/authentication/authentication.service';

@Component({
  selector: 'app-photo-miniature',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatDialogModule],
  templateUrl: './photo-miniature.component.html',
  styleUrl: './photo-miniature.component.scss',
})
export class PhotoMiniatureComponent implements OnInit {
  private authenticationService = inject(AuthenticationService);
  readonly modal = inject(MatDialog);

  photo = input.required<Photo>();

  isLikeableSig = signal<boolean>(true);

  openModal() {
    this.modal.open(PhotoModalComponent, {
      data: { item: this.photo() },
    });
  }

  ngOnInit(): void {
    this.authenticationService.isUserAuth.subscribe((value) =>
      this.isLikeableSig.set(value)
    );
  }
}
