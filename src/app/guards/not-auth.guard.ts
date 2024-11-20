import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const notAuthGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');

  const router: Router = inject(Router);
  if (token) {
    return router.navigate(['/home']);
  } else {
    return true;
  }
};
