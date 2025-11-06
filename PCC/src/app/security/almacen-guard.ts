import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { RoleService } from '../services/role';
import { map, take, combineLatest } from 'rxjs';

export const almacenGuard: CanActivateFn = (route, state) => {
  const roleService = inject(RoleService);
  const router = inject(Router);

  // Combina los observables: ¿es Admin? ¿es Almacenista?
  return combineLatest([
    roleService.isAdmin(),
    roleService.isAlmacenista()
  ]).pipe(
    take(1),
    map(([isAdmin, isAlmacenista]) => {
      // Si es CUALQUIERA de los dos, déjalo pasar
      if (isAdmin || isAlmacenista) {
        return true;
      }
      return router.createUrlTree(['/']); // No es ninguno, al inicio
    })
  );
};