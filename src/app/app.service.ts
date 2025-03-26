import {inject, Injectable, PLATFORM_ID} from "@angular/core";
import {isPlatformBrowser} from "@angular/common";
import {SendContactFormDto} from "../common/interface/i.contact-form";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public readonly platformId = inject(PLATFORM_ID);

  public runInBrowser(callback: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      callback();
    }
  }
}
