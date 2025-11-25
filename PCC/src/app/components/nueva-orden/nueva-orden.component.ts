import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Customer, Order } from '../../services/app.service';

@Component({
  selector: 'app-nueva-orden',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nueva-orden.component.html',
  styleUrl: './nueva-orden.component.css'
})
export class NuevaOrdenComponent implements OnInit {
  private apiService = inject(ApiService);
  customers: Customer[] = [];
  loading: boolean = false;

  ngOnInit(): void {
    this.loadCustomers();
    
    const form = document.getElementById('formOrden') as HTMLFormElement;
    if (form) {
      form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
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
    const factura = formData.get('factura') as string;
    const fecha = formData.get('fecha') as string;
    const metodoPago = formData.get('metodo_pago') as string;
    const estatus = formData.get('estatus') as string;
    
    // Validar campos requeridos
    if (!producto || !cliente || !factura || !fecha || !metodoPago || !estatus) {
      alert('⚠️ Por favor completa todos los campos requeridos.');
      return;
    }
    
    const order: Order = {
      CustomerID: parseInt(cliente),
      Product: producto,
      Invoice: factura,
      OrderDate: fecha,
      PaymentMethod: metodoPago,
      estado: estatus
    };
    
    // Enviar al backend
    this.apiService.createOrder(order).subscribe({
      next: (response) => {
        alert('✅ Orden creada exitosamente!');
        console.log('Orden creada:', response);
        form.reset();
      },
      error: (err) => {
        console.error('Error al crear orden:', err);
        alert('❌ Error al crear la orden. Por favor verifica los datos.');
      }
    });
  }
}
