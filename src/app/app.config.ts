import {ApplicationConfig, importProvidersFrom, isDevMode, LOCALE_ID} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {BrowserModule, provideClientHydration} from '@angular/platform-browser';
import {HttpClient, provideHttpClient} from "@angular/common/http";
import {initializeApp, provideFirebaseApp} from "@angular/fire/app";
import {environment} from "../environment/environment";
import {getAnalytics, provideAnalytics} from "@angular/fire/analytics";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {isSupportedLanguageCodeEnum, LanguageCodeEnum} from "./enum/language-code.enum";
import {tokens} from "./token";
import {AppService} from "./app.service";
import {DEFAULTS, SETTINGS} from "@angular/fire/compat/remote-config";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {DOCUMENT} from "@angular/common";

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),

    provideHttpClient(),
    BrowserModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    importProvidersFrom(
      TranslateModule.forRoot({
        useDefaultLang: true,
        defaultLanguage: LanguageCodeEnum.uk,
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })
    ),

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
        appService.translateService.use(userLang);
        return appService.translateService.currentLang;
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
