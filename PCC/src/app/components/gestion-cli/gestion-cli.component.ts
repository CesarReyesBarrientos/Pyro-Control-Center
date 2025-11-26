import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Customer } from '../../services/app.service';

interface CustomerDisplay {
  customerId: number;
  cliente: string;
  telefono: string;
  correo: string;
  direccion: string;
  pais: string;
}

@Component({
  selector: 'app-gestion-cli',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-cli.component.html',
  styleUrl: './gestion-cli.component.css'
})
export class GestionCliComponent implements OnInit {
  private apiService = inject(ApiService);
  
  customers: CustomerDisplay[] = [];
  loading: boolean = false;
  error: string | null = null;
  showEditModal: boolean = false;
  editForm = {
    CustomerID: 0,
    CustomerName: '',
    PhoneNumber: '',
    Email: '',
    Address: '',
    CountryCode: '52',
    State: '',
    PostalCode: '',
    CountryName: 'México'
  };

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.loading = true;
    this.error = null;
    
    this.apiService.getCustomers().subscribe({
      next: (data: Customer[]) => {
        this.customers = data.map(customer => ({
          customerId: customer.CustomerID || 0,
          cliente: customer.CustomerName || '-',
          telefono: this.formatPhone(customer.CountryCode, customer.PhoneNumber),
          correo: customer.Email || '-',
          direccion: this.formatAddress(customer.Address, customer.State, customer.PostalCode),
          pais: customer.CountryName || '-'
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
        this.error = 'Error al cargar los clientes. Por favor intenta nuevamente.';
        this.loading = false;
      }
    });
  }

  formatPhone(countryCode: string | undefined, phoneNumber: string | undefined): string {
    if (!phoneNumber) return '-';
    const code = countryCode || '';
    return `+${code} ${phoneNumber}`.trim();
  }

  formatAddress(address: string | undefined, state: string | undefined, postalCode: string | undefined): string {
    const parts = [];
    if (address) parts.push(address);
    if (state) parts.push(state);
    if (postalCode) parts.push(`CP ${postalCode}`);
    return parts.length > 0 ? parts.join(', ') : '-';
  }

  editCustomer(customer: CustomerDisplay) {
    // Buscar el cliente completo desde el backend para obtener todos los campos
    this.apiService.getCustomers().subscribe({
      next: (customers: Customer[]) => {
        const fullCustomer = customers.find(c => c.CustomerID === customer.customerId);
        if (fullCustomer) {
          this.editForm = {
            CustomerID: fullCustomer.CustomerID || 0,
            CustomerName: fullCustomer.CustomerName || '',
            PhoneNumber: fullCustomer.PhoneNumber || '',
            Email: fullCustomer.Email || '',
            Address: fullCustomer.Address || '',
            CountryCode: fullCustomer.CountryCode || '52',
            State: fullCustomer.State || '',
            PostalCode: fullCustomer.PostalCode || '',
            CountryName: fullCustomer.CountryName || 'México'
          };
          this.showEditModal = true;
          console.log('📝 Formulario cargado con:', this.editForm);
        }
      },
      error: (err) => {
        console.error('Error al cargar cliente:', err);
        alert('Error al cargar los datos del cliente.');
      }
    });
  }

  saveCustomer() {
    if (!this.editForm.CustomerName || !this.editForm.Email) {
      alert('Por favor completa los campos obligatorios (Nombre y Email).');
      return;
    }

    // Validar formato de email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(this.editForm.Email)) {
      alert('Por favor ingresa un correo electrónico válido.');
      return;
    }

    // Validar teléfono si se proporciona
    if (this.editForm.PhoneNumber && !/^[0-9]{10}$/.test(this.editForm.PhoneNumber)) {
      alert('El teléfono debe contener exactamente 10 dígitos.');
      return;
    }

    // Validar código de país si se proporciona
    if (this.editForm.CountryCode && !/^[0-9]{1,4}$/.test(this.editForm.CountryCode)) {
      alert('El código de país debe contener solo números (1-4 dígitos).');
      return;
    }

    const customerData: Customer = {
      CustomerName: this.editForm.CustomerName,
      Email: this.editForm.Email,
      PhoneNumber: this.editForm.PhoneNumber,
      CountryCode: this.editForm.CountryCode,
      Address: this.editForm.Address,
      State: this.editForm.State,
      PostalCode: this.editForm.PostalCode,
      CountryName: this.editForm.CountryName
    };

    this.apiService.updateCustomer(this.editForm.CustomerID, customerData).subscribe({
      next: (response) => {
        console.log('✅ Cliente actualizado:', response.message);
        alert('Cliente actualizado correctamente');
        this.closeEditModal();
        this.loadCustomers();
      },
      error: (error) => {
        console.error('❌ Error al actualizar cliente:', error);
        alert('Error al actualizar el cliente. Por favor, intenta nuevamente.');
      }
    });
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  deleteCustomer(customerId: number, nombre: string) {
    const confirmacion = confirm(
      `¿Estás seguro de dar de baja el cliente "${nombre}"?`
    );

    if (!confirmacion) return;

    this.apiService.deactivateCustomer(customerId).subscribe({
      next: (response) => {
        console.log('✅ Cliente dado de baja:', response.message);
        alert('Cliente dado de baja correctamente');
        this.loadCustomers();
      },
      error: (error) => {
        console.error('❌ Error al dar de baja el cliente:', error);
        alert('Error al dar de baja el cliente. Por favor, intenta nuevamente.');
      }
    });
  }
}
