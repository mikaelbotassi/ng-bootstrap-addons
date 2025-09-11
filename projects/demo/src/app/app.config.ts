import { ApplicationConfig, importProvidersFrom, inject, LOCALE_ID, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';
import {routes} from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { provideNgxMask } from 'ngx-mask';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { TimepickerConfig } from 'ngx-bootstrap/timepicker';
import { defineLocale, ptBrLocale } from 'ngx-bootstrap/chronos';

function setNgxBootstrapLocale() {
  // Define o locale pt-br para chronos (ngx-bootstrap)
  defineLocale('pt-br', ptBrLocale);
  
  const localeService = inject(BsLocaleService);
  return localeService.use('pt-br');
}

export function getTimepickerConfig(): TimepickerConfig {
  const config = new TimepickerConfig();
  config.showMeridian = false; // força formato 24h
  return config;
}

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes, withRouterConfig({ onSameUrlNavigation: 'reload' })),
    provideHttpClient(
      withFetch(),
    ),
    provideAnimations(),
    provideNgxMask(),
    //Ngx Bootstrap Providers
    {
      provide: TimepickerConfig,
      useFactory: getTimepickerConfig
    },
    provideAppInitializer(setNgxBootstrapLocale),
    importProvidersFrom([
      TooltipModule.forRoot(),
      ModalModule.forRoot(),
      BsDropdownModule.forRoot(),
      BsDatepickerModule.forRoot()
    ])
  ]
};