import {
  ApplicationConfig,
  enableProdMode,
  isDevMode,
  provideExperimentalZonelessChangeDetection
} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideClientHydration, withI18nSupport} from '@angular/platform-browser';
import {provideHttpClient} from "@angular/common/http";
import {initializeApp, provideFirebaseApp} from "@angular/fire/app";
import {getAnalytics, provideAnalytics} from "@angular/fire/analytics";
import {tokens} from "./token";
import {DEFAULTS, SETTINGS} from "@angular/fire/compat/remote-config";
import {environment} from "../environments/environment";

if (environment.production) {
  enableProdMode();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(
      withI18nSupport(),
    ),

    provideExperimentalZonelessChangeDetection(),

    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),

    ...tokens,

    {
      provide: DEFAULTS,
      useValue: {
        enableAwesome: true
      }
    },
    {
      provide: SETTINGS,
      useFactory: () => isDevMode() ? {minimumFetchIntervalMillis: 10_000} : {}
    }
  ]
};
