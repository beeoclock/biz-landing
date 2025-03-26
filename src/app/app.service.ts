import {inject, Injectable, PLATFORM_ID} from "@angular/core";
import {isPlatformBrowser} from "@angular/common";

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
