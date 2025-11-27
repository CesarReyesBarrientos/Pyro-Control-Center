import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// si ya tienes environment, úsalo; si no, pon la URL directo
const API = 'https://bd-pyrocontrolcenter.onrender.com';

export interface Proveedor {
  id: number;
  nombre: string;
  telefono: string;
  email: string;
  direccion: string;
  rfc: string;
}

export interface Supplier {
  id: number;
  nombre: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  rfc?: string;
  estado?: number;
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
  minstock?: number;  // Campo antiguo
  unidad_de_medida: string;
  precio?: number;
  proveedor_id?: number;
  proveedor_nombre?: string;
  notas?: string;
  estado?: number;
}

export interface InventarioCreate {
  id?: number;
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
  OrderID?: number;
  CustomerID: number;
  Product?: string;
  Invoice: string;
  OrderDate: string;
  PaymentMethod: string;
  estado: string;
  CustomerName?: string;
}

export interface Customer {
  CustomerID?: number;
  CustomerName: string;
  Email: string;
  PhoneNumber: string;
  CountryCode: string;
  Address?: string;
  State?: string;
  PostalCode?: string;
  CountryName?: string;
  estado?: number;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  getInventory() {
    return this.http.get<InventarioItem[]>(`${API}/api/inventory`);
  }

  searchInventory(searchTerm: string) {
    return this.http.get<{ success: boolean; count: number; data: InventarioItem[] }>(
      `${API}/api/inventory/search?q=${encodeURIComponent(searchTerm)}`
    );
  }

  getCategories() {
    return this.http.get<string[]>(`${API}/api/inventory/categories`);
  }

  getUnits() {
    return this.http.get<string[]>(`${API}/api/inventory/units`);
  }

  createInventory(body: InventarioCreate) {
    return this.http.post<{ id: number }>(`${API}/api/inventory`, body);
  }

  deleteProduct(id: number) {
    return this.http.delete<{ message: string }>(`${API}/api/inventory/${id}`);
  }

  updateProduct(id: number, product: any) {
    return this.http.put<{ message: string }>(`${API}/api/inventory/${id}`, product);
  }

  getSuppliers() {
    return this.http.get<Supplier[]>(`${API}/api/proveedores`);
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

  validateInvoice(invoice: string) {
    return this.http.get<{ exists: boolean; invoice: string }>(`${API}/api/orders/validate-invoice/${invoice}`);
  }

  createOrder(order: Order) {
    return this.http.post<{ message: string; orderId: number }>(`${API}/api/orders`, order);
  }

  updateOrder(id: number, order: Order) {
    return this.http.put<{ message: string }>(`${API}/api/orders/${id}`, order);
  }

  deactivateOrder(id: number) {
    return this.http.delete<{ message: string }>(`${API}/api/orders/${id}`);
  }

  downloadOrderPDF(id: number) {
    return this.http.get(`${API}/api/orders/${id}/pdf`, { responseType: 'blob' });
  }

  getCustomers() {
    return this.http.get<Customer[]>(`${API}/api/customers`);
  }

  createCustomer(customer: Customer) {
    return this.http.post<{ message: string; customerId: number }>(`${API}/api/customers`, customer);
  }

  updateCustomer(id: number, customer: Customer) {
    return this.http.put<{ message: string }>(`${API}/api/customers/${id}`, customer);
  }

  deactivateCustomer(id: number) {
    return this.http.put<{ message: string }>(`${API}/api/customers/${id}/deactivate`, {});
  }
}
