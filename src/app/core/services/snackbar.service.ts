// angular stuff
import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

// components
import { SnackbarTemplateComponent } from '../../shared/components/snackbar-template/snackbar-template.component';

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  private snackBar = inject(MatSnackBar);

  openSnackbar(message: string) {
    this.snackBar.openFromComponent(SnackbarTemplateComponent, {
      data: { message },
      duration: 5000,
      horizontalPosition: 'left',
    });
  }
}
