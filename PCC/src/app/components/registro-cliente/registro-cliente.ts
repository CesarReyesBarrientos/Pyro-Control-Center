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
    
    // Validar que el formulario sea válido
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    
    const formData = new FormData(form);
    
    // Validar que todos los campos requeridos estén llenos
    const customerName = formData.get('CustomerName') as string;
    const email = formData.get('email') as string;
    const telefono = formData.get('telefono') as string;
    const codigoPais = formData.get('codigo_pais') as string;
    const direccion = formData.get('direccion') as string;
    const estado = formData.get('estado') as string;
    const pais = formData.get('pais') as string;
    const codigoPostal = formData.get('codigo_postal') as string;
    
    if (!customerName || !email || !telefono || !codigoPais || !direccion || !estado || !pais || !codigoPostal) {
      alert('⚠️ Por favor completa todos los campos requeridos.');
      return;
    }
    
    const customer: Customer = {
      CustomerName: customerName.trim(),
      Email: email.trim(),
      PhoneNumber: telefono.trim(),
      CountryCode: codigoPais,
      Address: direccion.trim(),
      State: estado.trim(),
      PostalCode: codigoPostal.trim(),
      CountryName: pais.trim(),
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
