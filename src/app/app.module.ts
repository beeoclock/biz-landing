import {isDevMode, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

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
import {environment} from '../environments/environment';
import {getRemoteConfig, provideRemoteConfig} from '@angular/fire/remote-config';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpClient} from "@angular/common/http";
import {LanguageCodeEnum} from "./enum/language-code.enum";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './asset/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
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
    })
  ],
  providers: [
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
  constructor(
    private readonly remoteConfig: AngularFireRemoteConfig
  ) {
    this.remoteConfig.fetchAndActivate();
  }
}
