import { Component, OnInit, inject } from '@angular/core';
import { ApiService, Customer } from '../../services/app.service';

@Component({
  selector: 'app-registro-cliente',
  templateUrl: './registro-cliente.html',
  styleUrl: './registro-cliente.css',
})
export class RegistroCliente implements OnInit {
  private apiService = inject(ApiService);

  ngOnInit(): void {
    const form = document.getElementById('formCliente') as HTMLFormElement;
    if (form) {
      form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
  }

  handleSubmit(event: Event): void {
    event.preventDefault();
    
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const customer: Customer = {
      CustomerName: formData.get('CustomerName') as string,
      Email: formData.get('email') as string,
      PhoneNumber: formData.get('telefono') as string,
      CountryCode: formData.get('codigo_pais') as string,
      Address: formData.get('direccion') as string || undefined,
      City: formData.get('ciudad') as string || undefined,
      State: formData.get('estado') as string || undefined,
      PostalCode: formData.get('codigo_postal') as string || undefined,
      estado: formData.get('activo') ? 1 : 0
    };

    this.apiService.createCustomer(customer).subscribe({
      next: (response) => {
        alert('✅ Cliente creado exitosamente!');
        console.log('Cliente creado:', response);
        form.reset();
      },
      error: (err) => {
        console.error('Error al crear cliente:', err);
        alert('❌ Error al crear cliente. Por favor verifica los datos.');
      }
    });
  }
}
