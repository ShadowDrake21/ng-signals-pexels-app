import { JsonPipe, NgOptimizedImage } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Photo } from 'pexels';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PhotoModalComponent } from './components/photo-modal/photo-modal.component';

@Component({
  selector: 'app-photo-miniature',
  standalone: true,
  imports: [
    JsonPipe,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './photo-miniature.component.html',
  styleUrl: './photo-miniature.component.scss',
})
export class PhotoMiniatureComponent {
  readonly modal = inject(MatDialog);
  photo = input.required<Photo>();

  openModal() {
    const modalRef = this.modal.open(PhotoModalComponent, {
      data: { item: this.photo() },
    });

    modalRef.afterClosed().subscribe((result) => {
      console.log(`Modal result: ${result}`);
    });
  }
}
