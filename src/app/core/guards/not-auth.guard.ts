import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../authentication/authentication.service';
import { catchError, map, Observable, of, switchMap, take } from 'rxjs';

export const notAuthGuard: CanActivateFn = (route, state) => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  if (authenticationService.isAuthorized) {
    router.navigate(['/home']);
    return false;
  }

  return true;
};
