import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private roleNamespace = 'https://PyroControlCenter.com/roles';

  constructor(public auth: AuthService) { }

  public roles$: Observable<string[]> = this.auth.user$.pipe(
    map(user => user?.[this.roleNamespace] || [])
  );

  public hasRole(role: string): Observable<boolean> {
    return this.roles$.pipe(map(roles => roles.includes(role)));
  }

  public isAdmin(): Observable<boolean> {
    return this.hasRole('Admin');
  }

  public isAlmacenista(): Observable<boolean> {
    return this.hasRole('Almacenista');
  }

  public isProduccion(): Observable<boolean> {
    return this.hasRole('Gerente de producción');
  }
}