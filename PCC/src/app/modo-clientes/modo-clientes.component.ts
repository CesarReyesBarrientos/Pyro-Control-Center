import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modo-clientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modo-clientes.component.html',
  styleUrl: './modo-clientes.component.css'
})
export class ModoClientesComponent {
  selectedModule: string | null = null;

  constructor(private router: Router) {}

  selectModule(module: string) {
    this.selectedModule = module;

    // Navegación inmediata según la imagen seleccionada
    if (module === 'agregar') {
      this.router.navigate(['/registro-cliente']); 
    } else if (module === 'ver') {
      this.router.navigate(['/gestion-cli']);
    }
  }

  goBack(): void {
    this.router.navigateByUrl('modo');
  }
}