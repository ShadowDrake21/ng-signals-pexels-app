// angular stuff
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Photo } from 'pexels';

@Component({
  selector: 'app-photo-modal',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './photo-modal.component.html',
  styleUrl: './photo-modal.component.scss',
})
export class PhotoModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { item: Photo }) {}
}
