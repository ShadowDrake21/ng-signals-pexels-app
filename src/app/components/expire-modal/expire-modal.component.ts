// angular stuff
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-expire-modal',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    RouterLink,
  ],
  templateUrl: './expire-modal.component.html',
  styleUrl: './expire-modal.component.scss',
})
export class ExpireModalComponent {}
