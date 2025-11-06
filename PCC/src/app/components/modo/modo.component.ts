import { Component } from '@angular/core';
import { RoleService } from '../../services/role';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-modo',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './modo.component.html',
  styleUrls: ['./modo.component.css']
})


export class ModoComponent {
  // Expón los observables de roles a tu plantilla
  public isAdmin$ = this.roleService.isAdmin();
  public isProduccion$ = this.roleService.isProduccion();

  constructor(private roleService: RoleService) {}
}