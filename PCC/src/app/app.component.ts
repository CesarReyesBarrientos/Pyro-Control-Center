import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { ProductComponent } from './components/product/product.component';
import { OrdenesCliComponent } from './components/ordenes-cli/ordenes-cli.component';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,InicioComponent,LoginComponent, OrdenesCliComponent, ProductComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'PCC';
}
