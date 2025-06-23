import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { ModoComponent } from './components/modo/modo.component';
import { NgModule } from '@angular/core';
import { GestionCliComponent } from './components/gestion-cli/gestion-cli.component';
import { GestionInvComponent } from './components/gestion-inv/gestion-inv.component';


export const routes: Routes = [
    {path : '', component: InicioComponent},
    {path: 'login', component: LoginComponent},
     {path: 'modo', component: ModoComponent},
    { path: 'gestion-cli', component: GestionCliComponent },
  { path: 'gestion-inv', component: GestionInvComponent }
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports:[RouterModule]
})
export class AppRoutingModule {}