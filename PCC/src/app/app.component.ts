// src/app/app.component.ts

import { Component, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { RoleService } from './services/role';
import { filter, take, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  constructor(
    @Inject(DOCUMENT) public document: Document,
    public auth: AuthService,
    private router: Router,
    private roleService: RoleService
  ) {
    console.log('🚀 AppComponent constructor ejecutado');
    console.log('📍 URL actual:', window.location.href);
    
    // Detecta si venimos del callback de Auth0
    const hasCodeAndState = window.location.search.includes('code=') && 
                           window.location.search.includes('state=');
    
    console.log('🔍 ¿Tiene code y state?', hasCodeAndState);

    if (hasCodeAndState) {
      console.log('✅ Detectado callback de Auth0, esperando procesamiento...');
      
      // Espera a que Auth0 procese el callback
      this.auth.isLoading$
        .pipe(
          tap(loading => console.log('⏳ Cargando:', loading)),
          filter(loading => !loading), // Espera a que termine de cargar
          take(1),
          switchMap(() => this.auth.isAuthenticated$),
          tap(isAuth => console.log('🔐 ¿Autenticado?', isAuth)),
          filter(isAuthenticated => isAuthenticated),
          take(1)
        )
        .subscribe(() => {
          console.log('✅ Autenticación exitosa, procesando redirección...');
          this.handleSuccessfulLogin();
        });
        
      // También maneja errores
      this.auth.error$.pipe(take(1)).subscribe(error => {
        if (error) {
          console.error('❌ Error en el callback:', error);
          this.router.navigate(['/'], { replaceUrl: true });
        }
      });
    } else {
      console.log('ℹ️ No es un callback de Auth0, navegación normal');
    }
  }

  private handleSuccessfulLogin() {
    console.log('🎯 Iniciando redirección por roles...');
    
    // Debug: Muestra el usuario completo
    this.auth.user$.pipe(take(1)).subscribe(user => {
      console.log('👤 Usuario completo:', user);
      console.log('🔎 Roles en el namespace:', user?.['https://PyroControlCenter.com/roles']);
      console.log('🆔 User : ', user);
    });
    
    // Debug: Muestra los claims del token
    this.auth.idTokenClaims$.pipe(take(1)).subscribe(claims => {
      console.log('🎫 Token claims completo:', claims);
    });

    // Verifica si hay un appState guardado
    this.auth.appState$.pipe(take(1)).subscribe(appState => {
      console.log('📦 AppState:', appState);
      const target = appState?.target;
      
      if (target) {
        console.log('✅ Hay target definido, redirigiendo a:', target);
        setTimeout(() => {
          this.router.navigate([target], { replaceUrl: true });
        }, 100);
        return;
      }

      console.log('🔍 No hay target, consultando roles...');
      
      // Obtiene los roles y redirige
      this.roleService.roles$.pipe(take(1)).subscribe(roles => {
        console.log('👥 Roles obtenidos del servicio:', roles);
        console.log('📊 Cantidad de roles:', roles?.length || 0);
        
        if (!roles || roles.length === 0) {
          console.warn('⚠️ Usuario sin roles asignados, redirigiendo a inicio');
          setTimeout(() => {
            this.router.navigate(['/'], { replaceUrl: true });
          }, 100);
          return;
        }
        
        // Redirige según el rol
        let targetRoute = '/';
        
        if (roles.includes('Admin')) {
          console.log('✅ Usuario es Admin');
          targetRoute = '/modo';
        } else if (roles.includes('Almacenista')) {
          console.log('✅ Usuario es Almacenista');
          targetRoute = '/almacen';
        } else if (roles.includes('Gerente de producción')) {
          console.log('✅ Usuario es Gerente de producción');
          targetRoute = '/modo';
        } else {
          console.warn('⚠️ Rol no reconocido:', roles[0]);
          targetRoute = '/';
        }
        
        console.log('🎯 Redirigiendo a:', targetRoute);
        setTimeout(() => {
          this.router.navigate([targetRoute], { replaceUrl: true });
        }, 100);
      });
    });
  }

  logout(): void {
    console.log('👋 Cerrando sesión...');
    this.auth.logout({ 
      logoutParams: {
        returnTo: this.document.location.origin 
      }
    });
  }
}