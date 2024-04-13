import {isDevMode, LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {DEFAULTS, SETTINGS} from '@angular/fire/compat/remote-config';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {environment} from '../environment/environment';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {isSupportedLanguageCodeEnum, LanguageCodeEnum} from "./enum/language-code.enum";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {AppService} from "./app.service";
import {ChangeLanguageComponent} from "./component/change-language/change-language.component";
import {getAnalytics, provideAnalytics} from "@angular/fire/analytics";

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    TranslateModule.forRoot({
      useDefaultLang: true,
      defaultLanguage: LanguageCodeEnum.uk,
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ChangeLanguageComponent
  ],
  providers: [
    {
      provide: LOCALE_ID,
      deps: [AppService],
      useFactory: (appService: AppService) => {

        const userLang = (() => {

          // Get language from url
          const url = new URL(window.location.href);
          const userLangByUrl = url.pathname.split('/')[1];

          if (isSupportedLanguageCodeEnum(userLangByUrl)) {
            return userLangByUrl;
          }

          const userLangByLocalStorage: string | null = localStorage.getItem('language');

          if (userLangByLocalStorage) {
            return userLangByLocalStorage;
          }

          const userLangByNavigator: string | undefined = navigator?.language?.split?.('-')?.[0];

          if (isSupportedLanguageCodeEnum(userLangByNavigator)) {
            return userLangByNavigator;
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
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
