import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-modo-clientes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './modo-clientes.component.html',
  styleUrl: './modo-clientes.component.css'
})
export class ModoClientesComponent {
  selectedModule: string | null = null;

  constructor(private router: Router) {}

  selectModule(module: string) {
    this.selectedModule = module;

    // Navegación inmediata según la imagen seleccionada
    if (module === 'registro') {
      this.router.navigate(['/registro-cliente']); // Ruta para ver la tabla de registro de clientes
    } else if (module === 'gestion') {
      this.router.navigate(['/gestion-cli']); // Ruta para gestión de clientes
    }
  }

  goBack(): void {
    this.router.navigateByUrl('modo');
  }
}