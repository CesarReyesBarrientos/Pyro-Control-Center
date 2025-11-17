import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// si ya tienes environment, úsalo; si no, pon la URL directo
const API = 'http://localhost:3000';

export interface Proveedor {
  id: number;
  nombre: string;
  telefono: string;
  email: string;
  direccion: string;
  rfc: string;
}

export interface NuevoProveedor {
  nombre: string;
  telefono: string;
  email: string;
  direccion: string;
  rfc: string;
}

export interface InventarioItem {
  id: number;
  sku?: number;
  nombre?: string;
  producto?: string;  // Campo antiguo
  categoria?: string;
  stock_actual?: number;
  stock?: number;     // Campo antiguo
  stock_minimo?: number;
  unidad_de_medida: string;
  precio?: number;
  proveedor_id?: number;
  proveedor_nombre?: string;
  notas?: string;
}

export interface InventarioCreate {
  id: number;
  nombre: string;
  categoria: string;
  stock_actual: number;
  stock_minimo: number;
  unidad_de_medida: string;
  precio: number;
  proveedor_id: number;
  notas?: string;
}

export interface Order {
  OrderID: number;
  Invoice: string;
  OrderDate: string;
  estado: string;
  CustomerName: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  getInventory() {
    return this.http.get<InventarioItem[]>(`${API}/api/inventory`);
  }

  createInventory(body: InventarioCreate) {
    return this.http.post<{ id: number }>(`${API}/api/inventory`, body);
  }

  getProveedores() {
    return this.http.get<Proveedor[]>(`${API}/api/proveedores`);
  }

  createProveedor(proveedor: NuevoProveedor) {
    return this.http.post<{ id: number }>(`${API}/api/proveedores`, proveedor);
  }

  getOrders() {
    return this.http.get<Order[]>(`${API}/api/orders`);
  }
}
