import {inject, Injectable, PLATFORM_ID} from "@angular/core";
import {isPlatformBrowser} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public readonly platformId = inject(PLATFORM_ID);

  public constructor() {
    if (isPlatformBrowser(this.platformId)) {

      // this.translateService.onLangChange.subscribe(() => {
      //   localStorage.setItem('language', this.translateService.currentLang);
      // });
    }
  }
}
