import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService, Customer, Order } from '../../services/app.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nueva-orden',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nueva-orden.component.html',
  styleUrl: './nueva-orden.component.css'
})
export class NuevaOrdenComponent implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);
  customers: Customer[] = [];

  goBack() {
    this.router.navigate(['/modo-ventas']);
  }
  loading: boolean = false;
  invoiceError = signal<string>('');
  private validationTimeout: any = null;

  ngOnInit(): void {
    this.loadCustomers();
    
    const form = document.getElementById('formOrden') as HTMLFormElement;
    if (form) {
      form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    // Agregar listener para validar factura en tiempo real
    const invoiceInput = document.getElementById('factura') as HTMLInputElement;
    if (invoiceInput) {
      invoiceInput.addEventListener('input', (e) => this.onInvoiceChange(e));
      invoiceInput.addEventListener('blur', (e) => this.onInvoiceBlur(e));
    }
  }

  onInvoiceChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.toUpperCase().trim();
    
    // Actualizar el input con el valor normalizado
    input.value = value;
    
    // Limpiar timeout anterior
    if (this.validationTimeout) {
      clearTimeout(this.validationTimeout);
    }
    
    // Validar solo si tiene el formato correcto
    const invoicePattern = /^[A-Z]{3}-\d{4}-\d{4,6}$/;
    if (value && invoicePattern.test(value)) {
      // Esperar 500ms después de que el usuario deje de escribir
      this.validationTimeout = setTimeout(() => {
        this.validateInvoiceExists(value);
      }, 500);
    } else if (value) {
      this.invoiceError.set('');
    } else {
      this.invoiceError.set('');
    }
  }

  onInvoiceBlur(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.toUpperCase().trim();
    
    if (value) {
      const invoicePattern = /^[A-Z]{3}-\d{4}-\d{4,6}$/;
      if (invoicePattern.test(value)) {
        this.validateInvoiceExists(value);
      }
    }
  }

  validateInvoiceExists(invoice: string): void {
    this.apiService.validateInvoice(invoice).subscribe({
      next: (response) => {
        if (response.exists) {
          this.invoiceError.set(`❌ La factura "${invoice}" ya existe. Use un número diferente.`);
        } else {
          this.invoiceError.set('');
        }
      },
      error: (err) => {
        console.error('Error validando factura:', err);
        this.invoiceError.set('');
      }
    });
  }

  loadCustomers(): void {
    this.loading = true;
    this.apiService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.loading = false;
        this.populateCustomerSelect();
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
        this.loading = false;
      }
    });
  }

  populateCustomerSelect(): void {
    const selectElement = document.getElementById('cliente') as HTMLSelectElement;
    if (selectElement) {
      // Limpiar opciones existentes excepto la primera
      while (selectElement.options.length > 1) {
        selectElement.remove(1);
      }
      
      // Agregar clientes de la BD
      this.customers.forEach(customer => {
        const option = document.createElement('option');
        option.value = customer.CustomerID?.toString() || '';
        option.textContent = customer.CustomerName;
        selectElement.appendChild(option);
      });
    }
  }

  handleSubmit(event: Event): void {
    event.preventDefault();
    
    const form = event.target as HTMLFormElement;
    
    // Validar que el formulario sea válido
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    
    const formData = new FormData(form);
    
    // Extraer datos del formulario
    const producto = formData.get('producto') as string;
    const cliente = formData.get('cliente') as string;
    let factura = formData.get('factura') as string;
    const fecha = formData.get('fecha') as string;
    const metodoPago = formData.get('metodo_pago') as string;
    const estatus = formData.get('estatus') as string;
    
    // Validar campos requeridos
    if (!producto || !cliente || !factura || !fecha || !metodoPago || !estatus) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos requeridos.',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }
    
    // Normalizar factura a mayúsculas
    factura = factura.toUpperCase().trim();
    
    // Validar formato de factura
    const invoicePattern = /^[A-Z]{3}-\d{4}-\d{4,6}$/;
    if (!invoicePattern.test(factura)) {
      Swal.fire({
        icon: 'error',
        title: 'Formato inválido',
        text: 'Formato de factura inválido. Use: XXX-YYYY-NNNN (ejemplo: FAC-2024-0001)',
        confirmButtonColor: '#ef4444'
      });
      return;
    }

    // Verificar si hay error de factura duplicada
    if (this.invoiceError()) {
      Swal.fire({
        icon: 'error',
        title: 'Factura duplicada',
        text: this.invoiceError(),
        confirmButtonColor: '#ef4444'
      });
      return;
    }
    
    const order: Order = {
      CustomerID: parseInt(cliente),
      Product: producto,
      Invoice: factura, // Ya normalizada a mayúsculas
      OrderDate: fecha,
      PaymentMethod: metodoPago,
      estado: estatus
    };
    
    // Enviar al backend
    this.apiService.createOrder(order).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Orden creada exitosamente',
          confirmButtonColor: '#10b981',
          timer: 2000
        });
        console.log('Orden creada:', response);
        form.reset();
      },
      error: (err) => {
        console.error('Error al crear orden:', err);
        const errorMsg = err.error?.message || 'Error al crear la orden. Por favor verifica los datos.';
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMsg,
          confirmButtonColor: '#ef4444'
        });
      }
    });
  }
}
