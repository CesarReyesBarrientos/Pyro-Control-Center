import { Component, signal } from '@angular/core';
import { ApiService, InventarioItem } from '../../services/app.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  items = signal<InventarioItem[]>([]);
  allItems = signal<InventarioItem[]>([]);
  searchTerm = signal<string>('');
  isSearching = signal<boolean>(false);
  searchResultCount = signal<number>(0);

  constructor(private api: ApiService) {
    this.loadAllProducts();
  }

  loadAllProducts() {
    this.api.getInventory().subscribe(data => {
      this.allItems.set(data);
      this.items.set(data);
    });
  }

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const term = input.value.trim();
    this.searchTerm.set(term);

    if (term === '') {
      this.items.set(this.allItems());
      this.isSearching.set(false);
      this.searchResultCount.set(0);
      return;
    }

    if (term.length >= 2) {
      this.isSearching.set(true);
      console.log('🔍 Buscando:', term);
      this.api.searchInventory(term).subscribe({
        next: (response) => {
          console.log('✅ Resultados:', response);
          this.items.set(response.data);
          this.searchResultCount.set(response.count);
          this.isSearching.set(false);
        },
        error: (error) => {
          console.error('❌ Error en búsqueda:', error);
          console.error('Status:', error.status);
          console.error('URL:', error.url);
          this.isSearching.set(false);
        }
      });
    }
  }

  clearSearch() {
    this.searchTerm.set('');
    this.items.set(this.allItems());
    this.isSearching.set(false);
    this.searchResultCount.set(0);
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
