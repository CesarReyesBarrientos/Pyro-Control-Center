import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { RoleService } from '../services/role';
import { map, take, combineLatest } from 'rxjs';

export const ventasGuard: CanActivateFn = (route, state) => {
  const roleService = inject(RoleService);
  const router = inject(Router);

  return combineLatest([
    roleService.isAdmin(),
    roleService.isProduccion()
  ]).pipe(
    take(1),
    map(([isAdmin, isProduccion]) => {
      // Si es Admin o de Producción, déjalo pasar
      if (isAdmin || isProduccion) {
        return true;
      }
      return router.createUrlTree(['/']); // No es ninguno, al inicio
    })
  );
};