// src/app/app.routes.ts

import { Routes } from '@angular/router';

// --- Componentes ---
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { ModoComponent } from './components/modo/modo.component';
import { GestionCliComponent } from './components/gestion-cli/gestion-cli.component';
import { GestionInvComponent } from './components/gestion-inv/gestion-inv.component';
import { ProductComponent } from './components/product/product.component';
import { OrdenesCliComponent } from './components/ordenes-cli/ordenes-cli.component';
import { ModoAlmacenComponent } from './modo-almacen/modo-almacen.component';
import { ModoVentasComponent } from './modo-ventas/modo-ventas.component';
import { ModoClientesComponent } from './modo-clientes/modo-clientes.component';
import { NuevoProductoComponent } from './components/nuevo-producto/nuevo-producto.component';
import { RegistroCliente } from './components/registro-cliente/registro-cliente';

// --- Guards ---
import { AuthGuard } from '@auth0/auth0-angular';
import { adminGuard } from './security/admin-guard';
import { almacenGuard } from './security/almacen-guard';
import { ventasGuard } from './security/produccion-guard'; 

export const routes: Routes = [
  // --- Rutas Públicas ---
  { path: '', component: InicioComponent },
  { path: 'login', component: LoginComponent },

  // --- Rutas Protegidas ---
  { 
    path: 'modo', 
    component: ModoComponent,
    canActivate: [AuthGuard] // Todos pueden entrar
  },
  { 
    path: 'gestion-cli', 
    component: GestionCliComponent,
    canActivate: [AuthGuard, ventasGuard] // Protegido por Ventas o Admin
  },
  { 
    path: 'inventario', 
    component: ProductComponent,
    canActivate: [AuthGuard, almacenGuard] // Protegido por Almacén o Admin
  },
  {
    path: 'gestion-inv', 
    component: GestionInvComponent,
    canActivate: [AuthGuard, adminGuard] // Protegido por Admin
  },
  {
    path: 'modo-almacen', 
    component: ModoAlmacenComponent,
    canActivate: [AuthGuard, almacenGuard] // Protegido por Almacén o Admin
  },
  { 
    path: 'nuevoprod', 
    component: NuevoProductoComponent,
    canActivate: [AuthGuard, almacenGuard] // Protegido por Almacén o Admin
  },
  {
    path: 'ordenes-cli',
    component: OrdenesCliComponent,
    canActivate: [AuthGuard, ventasGuard] // Protegido por Ventas o Admin
  },
  {
    path: 'registro-cliente',
    component: RegistroCliente,
    canActivate: [AuthGuard, ventasGuard] // Protegido por Ventas o Admin
  },
  {
    path: 'modo-ventas',
    component: ModoVentasComponent,
    canActivate: [AuthGuard, ventasGuard] // Protegido por Ventas o Admin
  },
  {
    path: 'modo-clientes',
    component: ModoClientesComponent,
    canActivate: [AuthGuard, ventasGuard] // Protegido por Ventas o Admin
  },

  { path: '**', redirectTo: '', pathMatch: 'full' }
];