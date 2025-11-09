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

  isLowStock(item: InventarioItem | undefined): boolean {
    if (!item) return false;
    // Only mark as low stock if a minimum is defined and is a valid number
    const minimumRaw = item.stock_minimo;
    if (minimumRaw === undefined || minimumRaw === null) return false;

    const currentRaw = item.stock_actual ?? item.stock;

    const minimum = Number(minimumRaw);
    const current = Number(currentRaw);

    if (Number.isNaN(minimum) || Number.isNaN(current)) return false;

    // If minimum is zero, do not treat as a configured threshold
    if (minimum === 0) return false;

    return current <= minimum;
  }
}
