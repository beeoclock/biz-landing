import {inject, Injectable} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public readonly translateService = inject(TranslateService);

  constructor() {
    this.translateService.onLangChange.subscribe(() => {
      localStorage.setItem('language', this.translateService.currentLang);
    });
  }
}
