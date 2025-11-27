import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { RoleService } from '../../services/role';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-modo',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './modo.component.html',
  styleUrls: ['./modo.component.css']
})
export class ModoComponent {
  
  public isAdmin$ = this.roleService.isAdmin();
  public isAlmacenista$ = this.roleService.isAlmacenista();
  public isGerenteProduccion$ = this.roleService.isProduccion(); 

  constructor(
    private roleService: RoleService,
    public auth: AuthService,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  logout(): void {
    this.auth.logout({ 
      logoutParams: { 
        returnTo: 'https://cesarreyesbarrientos.github.io/Pyro-Control-Center/'
      } 
    });
  }
}