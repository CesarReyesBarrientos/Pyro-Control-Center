import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { ModoComponent } from './components/modo/modo.component';
import { NgModule } from '@angular/core';
import { GestionCliComponent } from './components/gestion-cli/gestion-cli.component';
import { GestionInvComponent } from './components/gestion-inv/gestion-inv.component';
import { ProductComponent } from './components/product/product.component';
import { OrdenesCliComponent } from './components/ordenes-cli/ordenes-cli.component';
import { ModoAlmacenComponent } from './modo-almacen/modo-almacen.component';
import { NuevoProductoComponent } from './components/nuevo-producto/nuevo-producto.component';

export const routes: Routes = [
    {path : '', component: InicioComponent},
    {path: 'login', component: LoginComponent},
    {path: 'modo', component: ModoComponent},
    { path: 'gestion-cli', component: GestionCliComponent },
    { path: 'gestion-inv', component: GestionInvComponent },
    { path: 'almacen', component: ModoAlmacenComponent },
    { path: 'inventario', component: ProductComponent },
    { path: 'nuevoprod', component: NuevoProductoComponent }
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports:[RouterModule]
    
})
export class AppRoutingModule {}