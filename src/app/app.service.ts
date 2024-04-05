import {inject, Injectable} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {LOCAL_STORAGE} from "./tokens";

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public readonly translateService = inject(TranslateService);
  public readonly localStorage = inject(LOCAL_STORAGE);

  constructor() {
    this.translateService.onLangChange.subscribe(() => {
      this.localStorage.setItem('language', this.translateService.currentLang);
    });
  }
}
