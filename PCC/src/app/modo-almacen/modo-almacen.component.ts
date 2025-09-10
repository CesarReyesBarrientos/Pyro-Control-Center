import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-modo-almacen',
  standalone: true,
  imports: [],
  templateUrl: './modo-almacen.component.html',
  styleUrl: './modo-almacen.component.css'
})
export class ModoAlmacenComponent {
 selectedModule: string | null = null;

  constructor(private router: Router) {}

   selectModule(module: string) {
    this.selectedModule = module;

    // Navegación inmediata según la imagen seleccionada
    if (module === 'almacen') {
      this.router.navigate(['/inventario']); 
    } else if (module === 'ventas') {
      this.router.navigate(['nuevoprod']);
    }
  }

  continue(): void {
    if (this.selectedModule === 'ventas') {
      this.router.navigateByUrl('/gestion-cli');
    } else if (this.selectedModule === 'almacen') {
      this.router.navigateByUrl('/modo-almacen');
    }
  }

  goBack(): void {
    this.router.navigateByUrl('modo');
  }

  
}
