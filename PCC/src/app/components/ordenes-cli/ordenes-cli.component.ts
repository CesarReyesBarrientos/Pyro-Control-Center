import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, Order, Customer } from '../../services/app.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ordenes-cli',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ordenes-cli.component.html',
  styleUrl: './ordenes-cli.component.css'
})
export class OrdenesCliComponent implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);
  
  goBack() {
    this.router.navigate(['/modo-ventas']);
  }
  
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  customers: Customer[] = [];
  loading = true;
  error: string | null = null;
  
  // Filtros
  filters = {
    customer: '',
    product: '',
    paymentMethod: '',
    estado: ''
  };
  
  // Variables para edición
  isEditMode = false;
  selectedOrder: Order | null = null;
  editForm = {
    CustomerID: 0,
    Product: '',
    Invoice: '',
    OrderDate: '',
    PaymentMethod: '',
    estado: ''
  };

  ngOnInit(): void {
    this.loadOrders();
    this.loadCustomers();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = null;
    this.apiService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.filteredOrders = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar órdenes:', err);
        this.error = 'No se pudieron cargar las órdenes. Verifica que el servidor esté funcionando.';
        this.loading = false;
      }
    });
  }

  loadCustomers(): void {
    this.apiService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data;
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
      }
    });
  }

  editOrder(order: Order): void {
    this.selectedOrder = order;
    this.isEditMode = true;
    
    // Formatear la fecha para el input type="date"
    let formattedDate = '';
    if (order.OrderDate) {
      const orderDate = new Date(order.OrderDate);
      // Ajustar por zona horaria para evitar problemas de fecha
      const year = orderDate.getFullYear();
      const month = String(orderDate.getMonth() + 1).padStart(2, '0');
      const day = String(orderDate.getDate()).padStart(2, '0');
      formattedDate = `${year}-${month}-${day}`;
    }
    
    // Pre-llenar el formulario con los valores actuales de la orden
    this.editForm = {
      CustomerID: order.CustomerID || 0,
      Product: order.Product || '',
      Invoice: order.Invoice || '',
      OrderDate: formattedDate,
      PaymentMethod: order.PaymentMethod || '',
      estado: order.estado || 'Pendiente'
    };
    
    console.log('📝 Formulario cargado con:', this.editForm);
  }

  closeEditModal(): void {
    this.isEditMode = false;
    this.selectedOrder = null;
  }

  saveOrder(): void {
    if (!this.selectedOrder || !this.selectedOrder.OrderID) return;
    
    if (!this.editForm.CustomerID || !this.editForm.Invoice) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos requeridos.',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    const updatedOrder: Order = {
      CustomerID: this.editForm.CustomerID,
      Product: this.editForm.Product,
      Invoice: this.editForm.Invoice,
      OrderDate: this.editForm.OrderDate,
      PaymentMethod: this.editForm.PaymentMethod,
      estado: this.editForm.estado
    };

    this.apiService.updateOrder(this.selectedOrder.OrderID, updatedOrder).subscribe({
      next: (response) => {
        console.log('✅ Orden actualizada:', response.message);
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Orden actualizada correctamente',
          confirmButtonColor: '#10b981',
          timer: 2000
        });
        this.closeEditModal();
        this.loadOrders();
      },
      error: (error) => {
        console.error('❌ Error al actualizar orden:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al actualizar la orden. Por favor, intenta nuevamente.',
          confirmButtonColor: '#ef4444'
        });
      }
    });
  }

  applyFilters(): void {
    console.log('🔍 Aplicando filtros:', this.filters);
    this.filteredOrders = this.orders.filter(order => {
      const customerName = (order.CustomerName || '').toLowerCase();
      const filterCustomer = (this.filters.customer || '').toLowerCase().trim();
      
      const matchCustomer = !filterCustomer || customerName.includes(filterCustomer);
      
      const matchProduct = !this.filters.product || 
        order.Product === this.filters.product;
      
      const matchPaymentMethod = !this.filters.paymentMethod || 
        order.PaymentMethod === this.filters.paymentMethod;
      
      const matchEstado = !this.filters.estado || 
        order.estado === this.filters.estado;
      
      return matchCustomer && matchProduct && matchPaymentMethod && matchEstado;
    });
    console.log('✅ Órdenes filtradas:', this.filteredOrders.length, 'de', this.orders.length);
  }

  clearFilters(): void {
    this.filters = {
      customer: '',
      product: '',
      paymentMethod: '',
      estado: ''
    };
    this.applyFilters();
  }

  downloadPDF(orderId: number | undefined, invoice: string): void {
    if (!orderId) return;

    this.apiService.downloadOrderPDF(orderId).subscribe({
      next: (blob) => {
        // Crear URL del blob
        const url = window.URL.createObjectURL(blob);
        // Crear elemento <a> temporal para descargar
        const link = document.createElement('a');
        link.href = url;
        link.download = `Orden-${invoice}.pdf`;
        link.click();
        // Limpiar
        window.URL.revokeObjectURL(url);
        console.log('✅ PDF descargado:', invoice);
      },
      error: (error) => {
        console.error('❌ Error al descargar PDF:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al generar el PDF. Por favor, intenta nuevamente.',
          confirmButtonColor: '#ef4444'
        });
      }
    });
  }

  deleteOrder(orderId: number | undefined, invoice: string) {
    if (!orderId) return;

    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas dar de baja la orden "${invoice}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, dar de baja',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.deactivateOrder(orderId).subscribe({
          next: (response) => {
            console.log('✅ Orden dada de baja:', response.message);
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'Orden dada de baja correctamente',
              confirmButtonColor: '#10b981',
              timer: 2000
            });
            this.loadOrders();
          },
          error: (error) => {
            console.error('❌ Error al dar de baja la orden:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error al dar de baja la orden. Por favor, intenta nuevamente.',
              confirmButtonColor: '#ef4444'
            });
          }
        });
      }
    });
  }
}
