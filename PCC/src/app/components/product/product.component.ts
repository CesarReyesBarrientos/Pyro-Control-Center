import { Component, signal } from '@angular/core';
import { ApiService, InventarioItem } from '../../services/app.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  items = signal<InventarioItem[]>([]);

  constructor(private api: ApiService) {
    this.api.getInventory().subscribe(data => this.items.set(data));
  }

  sku(id: number) {
    return 'PROD-' + id.toString().padStart(3, '0');
  }
}
