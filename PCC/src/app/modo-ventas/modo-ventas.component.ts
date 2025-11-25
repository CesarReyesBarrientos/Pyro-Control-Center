import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modo-ventas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modo-ventas.component.html',
  styleUrl: './modo-ventas.component.css'
})
export class ModoVentasComponent {
  selectedModule: string | null = null;

  constructor(private router: Router) {}

  selectModule(module: string) {
    this.selectedModule = module;

    // Navegación inmediata según la imagen seleccionada
    if (module === 'agregar') {
      this.router.navigate(['/nueva-orden']); 
    } else if (module === 'ver') {
      this.router.navigate(['/ordenes-cli']);
    }
  }

  goBack(): void {
    this.router.navigateByUrl('modo');
  }
}