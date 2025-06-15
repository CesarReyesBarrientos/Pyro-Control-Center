import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { ModoComponent } from './components/modo/modo.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    {path : '', component: InicioComponent},
    {path: 'login', component: LoginComponent},
     {path: 'modo', component: ModoComponent}
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports:[RouterModule]
})
export class AppRoutingModule {}