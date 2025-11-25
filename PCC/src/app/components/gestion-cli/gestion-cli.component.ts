import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Customer } from '../../services/app.service';

interface CustomerDisplay {
  cliente: string;
  telefono: string;
  correo: string;
  direccion: string;
  pais: string;
}

@Component({
  selector: 'app-gestion-cli',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gestion-cli.component.html',
  styleUrl: './gestion-cli.component.css'
})
export class GestionCliComponent implements OnInit {
  private apiService = inject(ApiService);
  
  customers: CustomerDisplay[] = [];
  loading: boolean = false;
  error: string | null = null;

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.loading = true;
    this.error = null;
    
    this.apiService.getCustomers().subscribe({
      next: (data: Customer[]) => {
        this.customers = data.map(customer => ({
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
}
