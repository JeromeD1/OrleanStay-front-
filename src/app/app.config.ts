import { ApplicationConfig, provideExperimentalZonelessChangeDetection, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './interceptors/token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // provideZoneChangeDetection({ eventCoalescing: true }), 
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes), provideAnimationsAsync(),
    provideHttpClient(withInterceptors([tokenInterceptor])),
  ]
};
