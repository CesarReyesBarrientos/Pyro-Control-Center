import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { RoleService } from '../services/role';
import { map, take } from 'rxjs/operators';

export const adminGuard: CanActivateFn = (route, state) => {
  const roleService = inject(RoleService);
  const router = inject(Router);

  return roleService.isAdmin().pipe(
    take(1),
    map(isAdmin => {
      if (isAdmin) { return true; }
      return router.createUrlTree(['/']); // No es admin, al inicio
    })
  );
};