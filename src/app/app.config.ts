import {
  ApplicationConfig,
  enableProdMode,
  isDevMode,
  LOCALE_ID,
  provideExperimentalZonelessChangeDetection
} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {BrowserModule, provideClientHydration, withI18nSupport} from '@angular/platform-browser';
import {provideHttpClient} from "@angular/common/http";
import {initializeApp, provideFirebaseApp} from "@angular/fire/app";
import {environment} from "../environment/environment";
import {getAnalytics, provideAnalytics} from "@angular/fire/analytics";
import {isSupportedLanguageCodeEnum} from "./enum/language-code.enum";
import {tokens} from "./token";
import {AppService} from "./app.service";
import {DEFAULTS, SETTINGS} from "@angular/fire/compat/remote-config";
import {DOCUMENT} from "@angular/common";

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
      provide: LOCALE_ID,
      deps: [AppService, DOCUMENT],
      useFactory: (appService: AppService, document: Document) => {

        const userLang = (() => {

          // TODO use $localize to set default language
          // Get language from url
          // if (isSupportedLanguageCodeEnum(userLangByUrl)) {
          //   return userLangByUrl;
          // }

          const localStorage = document.defaultView?.localStorage;

          if (localStorage) {

            const userLangByLocalStorage: string | null = localStorage.getItem('language');

            if (userLangByLocalStorage) {
              return userLangByLocalStorage;
            }

          }

          const navigator = document.defaultView?.navigator;

          if (navigator) {

            const userLangByNavigator: string | undefined = navigator?.language?.split?.('-')?.[0];

            if (isSupportedLanguageCodeEnum(userLangByNavigator)) {
              return userLangByNavigator;
            }

          }

          return environment.config.language;
        })();
        return userLang;

      },
    },
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
