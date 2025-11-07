// src/app/app.config.ts

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAuth0 } from '@auth0/auth0-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    
    provideAuth0({
      domain: 'dev-1kquk0aiaxxh1wly.us.auth0.com',
      clientId: 'BzxusB3UeQ2RAUMkqibkVJ4r8ByiyIqn',
      
      authorizationParams: {
        redirect_uri: window.location.origin, // Más robusto que hardcodear
        // audience: 'https://dev-1kquk0aiaxxh1wly.us.auth0.com/api/v2/',
        // scope: 'openid profile email'
      },
      
      // Configuración de caché
      cacheLocation: 'localstorage',
      
      // Importante: esto permite que Auth0 maneje el callback automáticamente
      skipRedirectCallback: false,
      
      // Usar refresh tokens
      useRefreshTokens: true,
    })
  ]
};

