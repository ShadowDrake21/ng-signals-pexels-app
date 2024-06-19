import { JsonPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { Photo } from 'pexels';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-photo-miniature',
  standalone: true,
  imports: [JsonPipe, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './photo-miniature.component.html',
  styleUrl: './photo-miniature.component.scss',
})
export class PhotoMiniatureComponent {
  photo = input.required<Photo>();

  openModal() {
    console.log('modal opened');
  }
}
