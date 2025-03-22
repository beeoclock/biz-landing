import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject, LOCALE_ID } from '@angular/core';

@Component({
  selector: 'app-languages',
  standalone: true,
  templateUrl: './languages.page.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguagesPage {
  private readonly localeId = inject(LOCALE_ID);
  private readonly currentLanguageCode = this.localeId[0] + this.localeId[1];
  public selectedLanguageCode: string;

  public readonly languageList: { name: string; href: string; code: string }[] = [
    { name: 'Dansk', href: '/da', code: 'da' },
    { name: 'Polski', href: '/pl', code: 'pl' },
    { name: 'Ukrainian', href: '/uk', code: 'uk' },
    { name: 'English', href: '/en', code: 'en' }
  ];

  constructor() {
    this.selectedLanguageCode = this.languageList.some(lang => lang.code === this.currentLanguageCode) ? this.currentLanguageCode : 'en';
  }

  get filteredLanguages() {
    return this.languageList.filter(lang => lang.code !== this.selectedLanguageCode);
  }
}

export default LanguagesPage;
