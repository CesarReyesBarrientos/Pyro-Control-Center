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
        redirect_uri: window.location.origin
      }
    })
  ]
};
