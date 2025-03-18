import {inject, Injectable, PLATFORM_ID} from "@angular/core";
import {isPlatformBrowser} from "@angular/common";
import {SendContactFormDto} from "../common/interface/i.contact-form";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public readonly platformId = inject(PLATFORM_ID);
  public readonly http = inject(HttpClient)
  private apiUrl = 'https://api-dev.beeoclock.com/client/api/v1/contact';

  public constructor() {
    if (isPlatformBrowser(this.platformId)) {

      // this.translateService.onLangChange.subscribe(() => {
      //   localStorage.setItem('language', this.translateService.currentLang);
      // });
    }
  }

  sendContactForm(data: SendContactFormDto) {

    return this.http.post(this.apiUrl, data);
  }
}
