import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Order } from '../../services/app.service';

@Component({
  selector: 'app-ordenes-cli',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ordenes-cli.component.html',
  styleUrl: './ordenes-cli.component.css'
})
export class OrdenesCliComponent implements OnInit {
  private apiService = inject(ApiService);
  orders: Order[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = null;
    this.apiService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar órdenes:', err);
        this.error = 'No se pudieron cargar las órdenes. Verifica que el servidor esté funcionando.';
        this.loading = false;
      }
    });
  }

  deleteOrder(orderId: number | undefined, invoice: string) {
    if (!orderId) return;

    const confirmacion = confirm(
      `¿Estás seguro de dar de baja la orden "${invoice}"?`
    );

    if (!confirmacion) return;

    this.apiService.deactivateOrder(orderId).subscribe({
      next: (response) => {
        console.log('✅ Orden dada de baja:', response.message);
        alert('Orden dada de baja correctamente');
        this.loadOrders();
      },
      error: (error) => {
        console.error('❌ Error al dar de baja la orden:', error);
        alert('Error al dar de baja la orden. Por favor, intenta nuevamente.');
      }
    });
  }
}
