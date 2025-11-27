import { Component, signal, inject } from '@angular/core';
import { ApiService, InventarioItem, Supplier } from '../../services/app.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  private router = inject(Router);
  
  goBack() {
    this.router.navigate(['/modo-almacen']);
  }
  
  items = signal<InventarioItem[]>([]);
  allItems = signal<InventarioItem[]>([]);
  searchTerm = signal<string>('');
  isSearching = signal<boolean>(false);
  searchResultCount = signal<number>(0);
  
  // Filtros
  categories = signal<string[]>([]);
  suppliers = signal<string[]>([]);
  units = signal<string[]>([]);
  
  selectedCategory = signal<string>('');
  selectedSupplier = signal<string>('');
  selectedUnit = signal<string>('');

  // Modal de edición
  showEditModal = signal<boolean>(false);
  allSuppliers = signal<Supplier[]>([]);
  editForm: any = {
    id: null,
    nombre: '',
    categoria: '',
    stock_actual: 0,
    stock_minimo: 0,
    unidad_de_medida: '',
    precio: 0,
    proveedor_id: null,
    notas: ''
  };

  constructor(private api: ApiService) {
    this.loadAllProducts();
    this.loadFilters();
    this.loadSuppliers();
  }

  loadAllProducts() {
    this.api.getInventory().subscribe(data => {
      this.allItems.set(data);
      this.items.set(data);
      this.extractSuppliers(data);
    });
  }

  loadFilters() {
    this.api.getCategories().subscribe(data => this.categories.set(data));
    this.api.getUnits().subscribe(data => this.units.set(data));
  }

  loadSuppliers() {
    this.api.getSuppliers().subscribe(data => this.allSuppliers.set(data));
  }

  extractSuppliers(items: InventarioItem[]) {
    const uniqueSuppliers = [...new Set(
      items
        .map(item => item.proveedor_nombre)
        .filter((name): name is string => !!name && name !== 'N/A')
    )];
    this.suppliers.set(uniqueSuppliers.sort());
  }

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const term = input.value.trim();
    this.searchTerm.set(term);

    if (term === '') {
      this.applyFilters();
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
          this.items.set(this.filterResults(response.data));
          this.searchResultCount.set(this.items().length);
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

  onCategoryChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedCategory.set(select.value);
    this.applyFilters();
  }

  onSupplierChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedSupplier.set(select.value);
    this.applyFilters();
  }

  onUnitChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedUnit.set(select.value);
    this.applyFilters();
  }

  applyFilters() {
    let filtered = this.allItems();

    // Si hay búsqueda activa, no aplicar filtros sobre allItems
    if (this.searchTerm()) {
      return;
    }

    filtered = this.filterResults(filtered);
    this.items.set(filtered);
  }

  filterResults(items: InventarioItem[]): InventarioItem[] {
    let filtered = items;

    if (this.selectedCategory()) {
      filtered = filtered.filter(item => item.categoria === this.selectedCategory());
    }

    if (this.selectedSupplier()) {
      filtered = filtered.filter(item => item.proveedor_nombre === this.selectedSupplier());
    }

    if (this.selectedUnit()) {
      filtered = filtered.filter(item => item.unidad_de_medida === this.selectedUnit());
    }

    return filtered;
  }

  clearAllFilters() {
    this.searchTerm.set('');
    this.selectedCategory.set('');
    this.selectedSupplier.set('');
    this.selectedUnit.set('');
    this.items.set(this.allItems());
    this.searchResultCount.set(0);
  }

  clearSearch() {
    this.searchTerm.set('');
    this.applyFilters();
    this.isSearching.set(false);
    this.searchResultCount.set(0);
  }

  hasActiveFilters(): boolean {
    return !!(this.searchTerm() || this.selectedCategory() || this.selectedSupplier() || this.selectedUnit());
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

  deleteProduct(id: number, nombre: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas dar de baja el producto "${nombre}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, dar de baja',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.deleteProduct(id).subscribe({
          next: (response) => {
            console.log('✅ Producto dado de baja:', response.message);
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'Producto dado de baja correctamente',
              confirmButtonColor: '#10b981',
              timer: 2000
            });
            this.loadAllProducts();
          },
          error: (error) => {
            console.error('❌ Error al dar de baja el producto:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error al dar de baja el producto. Por favor, intenta nuevamente.',
              confirmButtonColor: '#ef4444'
            });
          }
        });
      }
    });
  }

  openEditModal(item: InventarioItem) {
    this.editForm = {
      id: item.id,
      nombre: item.nombre || item.producto || '',
      categoria: item.categoria || '',
      stock_actual: item.stock_actual || item.stock || 0,
      stock_minimo: item.stock_minimo || item.minstock || 0,
      unidad_de_medida: item.unidad_de_medida || '',
      precio: item.precio || 0,
      proveedor_id: item.proveedor_id || null,
      notas: item.notas || ''
    };
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
  }

  saveEdit(event: Event) {
    event.preventDefault();
    
    if (!this.editForm.id) return;

    this.api.updateProduct(this.editForm.id, this.editForm).subscribe({
      next: (response) => {
        console.log('✅ Producto actualizado:', response);
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Producto actualizado correctamente',
          confirmButtonColor: '#10b981',
          timer: 2000
        });
        this.closeEditModal();
        this.loadAllProducts();
      },
      error: (error) => {
        console.error('❌ Error al actualizar producto:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al actualizar el producto. Por favor, intenta nuevamente.',
          confirmButtonColor: '#ef4444'
        });
      }
    });
  }
}
