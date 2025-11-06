import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../services/app.service';
import { firstValueFrom } from 'rxjs';

interface Proveedor {
  id: number;
  nombre: string;
  telefono: string;
  email: string;
  direccion: string;
  rfc: string;
}

@Component({
  selector: 'app-nuevo-producto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './nuevo-producto.component.html',
  styleUrl: './nuevo-producto.component.css'
})
export class NuevoProductoComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);

  proveedores: Proveedor[] = [];
  mostrarFormProveedor = false;
  stockInputType = 'number';
  stockStep = '0.001';

  form = this.fb.group({
    id: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    nombre: ['', Validators.required],
    categoria: ['', Validators.required],
    stock_actual: ['', [Validators.required, Validators.min(0)]],
    stock_minimo: ['', [Validators.required, Validators.min(0)]],
    unidad: ['', Validators.required],
    precio: ['', [Validators.required, Validators.min(0)]],
    proveedor: ['', Validators.required],
    notas: [''],
    // Campos para nuevo proveedor
    nombre_proveedor: [''],
    telefono: [''],
    email: ['', Validators.email],
    direccion: [''],
    rfc: ['']
  });

  ngOnInit(): void {
    this.cargarProveedores();
  }

  cargarProveedores() {
    this.api.getProveedores().subscribe({
      next: (data) => {
        this.proveedores = data;
      },
      error: (error) => {
        console.error('Error al cargar proveedores:', error);
      }
    });
  }

  onUnidadChange(event: Event) {
    const unidad = (event.target as HTMLSelectElement).value;
    if (['CAJA', 'PZ', 'PAQUETE'].includes(unidad)) {
      this.stockInputType = 'number';
      this.stockStep = '1';
      // Redondear valores actuales si existen
      const stockActual = this.form.get('stock_actual')?.value;
      const stockMinimo = this.form.get('stock_minimo')?.value;
      if (stockActual) {
        this.form.patchValue({ 
          stock_actual: String(Math.round(Number(stockActual)))
        });
      }
      if (stockMinimo) {
        this.form.patchValue({ 
          stock_minimo: String(Math.round(Number(stockMinimo)))
        });
      }
    } else {
      this.stockInputType = 'number';
      this.stockStep = '0.001';
    }
  }

  onProveedorChange(event: Event) {
    const valor = (event.target as HTMLSelectElement).value;
    this.mostrarFormProveedor = valor === 'nuevo';
    if (this.mostrarFormProveedor) {
      this.form.get('nombre_proveedor')?.setValidators([Validators.required]);
      this.form.get('telefono')?.setValidators([Validators.required]);
      this.form.get('email')?.setValidators([Validators.required, Validators.email]);
      this.form.get('direccion')?.setValidators([Validators.required]);
      this.form.get('rfc')?.setValidators([Validators.required]);
    } else {
      this.form.get('nombre_proveedor')?.clearValidators();
      this.form.get('telefono')?.clearValidators();
      this.form.get('email')?.clearValidators();
      this.form.get('direccion')?.clearValidators();
      this.form.get('rfc')?.clearValidators();
    }
    // Actualizar el estado de validaci�n
    ['nombre_proveedor', 'telefono', 'email', 'direccion', 'rfc'].forEach(campo => {
      this.form.get(campo)?.updateValueAndValidity();
    });
  }

  async guardar() {
    console.log('Método guardar() llamado');
    console.log('Valores del formulario:', this.form.value);
    
    if (this.form.invalid) {
      console.log('Formulario inválido:', this.form.errors);
      this.form.markAllAsTouched();
      let mensajeError = 'Por favor, completa los siguientes campos:\n';
      
      // Revisar cada campo requerido
      if (this.form.get('sku')?.errors) {
        mensajeError += '- SKU (solo números)\n';
      }
      if (this.form.get('nombre')?.errors) {
        mensajeError += '- Nombre del material\n';
      }
      if (this.form.get('categoria')?.errors) {
        mensajeError += '- Categoría\n';
      }
      if (this.form.get('stock_actual')?.errors) {
        mensajeError += '- Stock actual (debe ser mayor o igual a 0)\n';
      }
      if (this.form.get('stock_minimo')?.errors) {
        mensajeError += '- Stock mínimo (debe ser mayor o igual a 0)\n';
      }
      if (this.form.get('unidad')?.errors) {
        mensajeError += '- Unidad de medida\n';
      }
      if (this.form.get('precio')?.errors) {
        mensajeError += '- Precio (debe ser mayor o igual a 0)\n';
      }
      if (this.form.get('proveedor')?.errors) {
        mensajeError += '- Proveedor\n';
      }

      // Si es nuevo proveedor, verificar campos adicionales
      if (this.mostrarFormProveedor) {
        if (this.form.get('nombre_proveedor')?.errors) {
          mensajeError += '- Nombre del proveedor\n';
        }
        if (this.form.get('telefono')?.errors) {
          mensajeError += '- Teléfono del proveedor\n';
        }
        if (this.form.get('email')?.errors) {
          mensajeError += '- Email del proveedor (formato válido)\n';
        }
        if (this.form.get('direccion')?.errors) {
          mensajeError += '- Dirección del proveedor\n';
        }
        if (this.form.get('rfc')?.errors) {
          mensajeError += '- RFC del proveedor\n';
        }
      }

      alert(mensajeError);
      return;
    }

    try {
      let proveedorId = this.form.value.proveedor;

      // Si es un nuevo proveedor, primero lo guardamos
      if (this.mostrarFormProveedor) {
        try {
          const nuevoProveedor = {
            nombre: this.form.value.nombre_proveedor!,
            telefono: this.form.value.telefono!,
            email: this.form.value.email!,
            direccion: this.form.value.direccion!,
            rfc: this.form.value.rfc!
          };
          
          const response = await firstValueFrom(this.api.createProveedor(nuevoProveedor));
          if (response?.id) {
            proveedorId = String(response.id);
          } else {
            throw new Error('No se pudo obtener el ID del proveedor creado');
          }
        } catch (error) {
          console.error('Error al crear proveedor:', error);
          alert('Error al crear el nuevo proveedor. Por favor, verifica los datos e intenta nuevamente.');
          return;
        }
      }

      // Luego guardamos el producto
      try {
        console.log('Preparando payload del producto');
        console.log('Form values:', {
          id: this.form.value.id,
          nombre: this.form.value.nombre,
          categoria: this.form.value.categoria,
          stock_actual: this.form.value.stock_actual,
          stock_minimo: this.form.value.stock_minimo,
          unidad: this.form.value.unidad,
          precio: this.form.value.precio,
          proveedor: this.form.value.proveedor,
          notas: this.form.value.notas
        });
      const payload = {
        id: Number(this.form.value.id),
        nombre: this.form.value.nombre!,
        categoria: this.form.value.categoria!,
        stock_actual: Number(this.form.value.stock_actual),
        stock_minimo: Number(this.form.value.stock_minimo),
        unidad_de_medida: this.form.value.unidad!,  // Enviamos el valor de unidad como unidad_de_medida
        precio: Number(this.form.value.precio),
        proveedor_id: Number(proveedorId),
        notas: this.form.value.notas || ''
      };
      console.log('Payload a enviar:', payload);        const result = await firstValueFrom(this.api.createInventory(payload));
        alert('¡Producto guardado exitosamente!');
        this.limpiarFormulario();
        
        // Opcional: recargar la lista de productos si está visible
        // this.api.getInventory().subscribe();
        
      } catch (error) {
        console.error('Error al guardar el producto:', error);
        alert('Error al guardar el producto. Por favor, verifica los datos e intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error general:', error);
      alert('Error inesperado. Por favor, intenta nuevamente o contacta al administrador.');
    }
  }

  limpiarFormulario() {
    this.form.reset({
      id: '',
      nombre: '',
      categoria: '',
      stock_actual: '',
      stock_minimo: '',
      unidad: '',
      precio: '',
      proveedor: '',
      notas: '',
      nombre_proveedor: '',
      telefono: '',
      email: '',
      direccion: '',
      rfc: ''
    });
    this.mostrarFormProveedor = false;
  }
}
