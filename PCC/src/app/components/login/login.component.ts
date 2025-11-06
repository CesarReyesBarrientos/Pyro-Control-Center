import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule], // Ya no necesitas FormsModule
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  // El constructor ahora es simple. Solo inyecta AuthService.
  constructor(public auth: AuthService) {}

  // Esta función es la única lógica que este componente necesita
  isLoggingIn = false;

  login(): void {
    if (this.isLoggingIn) return;
    this.isLoggingIn = true;
    this.auth.loginWithRedirect({
      appState: { target: '/modo' }
    });
  }
}

