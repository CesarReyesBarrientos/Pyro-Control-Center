// src/app/app.config.ts

import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAuth0 } from '@auth0/auth0-angular';
import { provideServiceWorker } from '@angular/service-worker';
// import { environment } from '../environments/environment'; // Opcional si usas la lógica de abajo

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),

    provideAuth0({
      domain: 'dev-1kquk0aiaxxh1wly.us.auth0.com',
      clientId: 'BzxusB3UeQ2RAUMkqibkVJ4r8ByiyIqn',

      authorizationParams: {
        redirect_uri: isDevMode() 
          ? window.location.origin 
          : 'https://cesarreyesbarrientos.github.io/Pyro-Control-Center',
      },

      // Configuración de caché
      cacheLocation: 'localstorage',

      // Importante: esto permite que Auth0 maneje el callback automáticamente
      skipRedirectCallback: false,

      // Usar refresh tokens
      useRefreshTokens: true,
    }),

    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ]
};