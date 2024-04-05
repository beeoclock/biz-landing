import {inject, isDevMode, LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule, provideClientHydration} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {
  AngularFireRemoteConfig,
  AngularFireRemoteConfigModule,
  DEFAULTS,
  SETTINGS
} from '@angular/fire/compat/remote-config';
import {AngularFireModule} from '@angular/fire/compat';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {environment} from '../environment/environment';
import {getRemoteConfig, provideRemoteConfig} from '@angular/fire/remote-config';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {isSupportedLanguageCodeEnum, LanguageCodeEnum} from "./enum/language-code.enum";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {AppService} from "./app.service";
import {ChangeLanguageComponent} from "./component/change-language/change-language.component";
import {LOCAL_STORAGE, NAVIGATOR} from "./tokens";

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function getLocalStorage() {
  return (typeof window !== "undefined") ? window.localStorage : {
    getItem: () => null,
    setItem: () => null,
    removeItem: () => null
  };
}

export function getNavigator() {
    return (typeof window !== "undefined") ? window.navigator : {
        language: undefined
    };
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireRemoteConfigModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideRemoteConfig(() => getRemoteConfig()),
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
      provide: LOCAL_STORAGE,
      useFactory: getLocalStorage
    },
    {
      provide: NAVIGATOR,
      useFactory: getLocalStorage
    },
    {
      provide: LOCALE_ID,
      deps: [AppService, LOCAL_STORAGE, NAVIGATOR],
      useFactory: (appService: AppService, LOCAL_STORAGE: Storage, NAVIGATOR: Navigator) => {

        const userLang = (() => {
          const userLangByLocalStorage: string | null = LOCAL_STORAGE.getItem('language');

          if (userLangByLocalStorage) {
            return userLangByLocalStorage;
          }

          const userLangByNavigator: string | undefined = NAVIGATOR?.language?.split?.('-')?.[0];

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
    },
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    private readonly remoteConfig: AngularFireRemoteConfig
  ) {
    this.remoteConfig.fetchAndActivate();
  }
}
