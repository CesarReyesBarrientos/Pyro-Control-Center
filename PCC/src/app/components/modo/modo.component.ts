import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modo',
  standalone: true,
  imports: [],
  templateUrl: './modo.component.html',
  styleUrl: './modo.component.css'
})
export class ModoComponent {
 selectedModule: string | null = null;

  constructor(private router: Router) {}

  selectModule(module: string): void {
    this.selectedModule = module;
  }

  continue(): void {
    if (this.selectedModule === 'ventas') {
      this.router.navigateByUrl('/gestion-cli');
    } else if (this.selectedModule === 'almacen') {
      this.router.navigateByUrl('/gestion-inv');
    }
  }

  goBack(): void {
    this.router.navigateByUrl('/');
  }
}