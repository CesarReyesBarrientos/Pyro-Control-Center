import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modo-ventas',
  standalone: true,
  imports: [],
  templateUrl: './modo-ventas.component.html',
  styleUrl: './modo-ventas.component.css'
})
export class ModoVentasComponent {
  selectedModule: string | null = null;

  constructor(private router: Router) {}

  selectModule(module: string) {
    this.selectedModule = module;

    // Navegación inmediata según la imagen seleccionada
    if (module === 'ordenes') {
      this.router.navigate(['/gestion-cli']); // Ruta para gestión de clientes
    } else if (module === 'clientes') {
      this.router.navigate(['/ordenes-cli']); // Ruta para ver órdenes de clientes
    }
  }

  goBack(): void {
    this.router.navigateByUrl('modo');
  }
}