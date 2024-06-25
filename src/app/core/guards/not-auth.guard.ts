import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../authentication/authentication.service';

export const notAuthGuard: CanActivateFn = (route, state) => {
  const authenticationService = inject(AuthenticationService);

  const router = inject(Router);

  if (authenticationService.isUserAuth.getValue()) {
    router.navigate(['home']);
  }

  return true;
};
