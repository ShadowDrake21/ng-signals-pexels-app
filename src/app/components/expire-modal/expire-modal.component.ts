import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

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
export class ExpireModalComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  readonly dialogRef = inject(MatDialogRef<ExpireModalComponent>);

  goToAuthPage() {
    console.log('navigation');
    this.router.navigate(['/authentication']);
    this.dialogRef.close();
  }
}
