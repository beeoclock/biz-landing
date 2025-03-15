import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject, LOCALE_ID } from '@angular/core';

@Component({
  selector: 'app-languages',
  templateUrl: './languages.page.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguagesPage {
  private readonly localeId = inject(LOCALE_ID);
  public selectedLanguage: string;

  public readonly languageList: { name: string; href: string; code: string }[] = [
    { name: 'Dansk', href: '/da', code: 'da' },
    { name: 'Polski', href: '/pl', code: 'pl' },
    { name: 'Ukrainian', href: '/uk', code: 'uk' },
    { name: 'English', href: '/en', code: 'en' }
  ];

  constructor() {
    this.selectedLanguage = this.languageList.find(lang => lang.code === this.localeId)?.name || 'English';
  }

  get filteredLanguages() {
    return this.languageList.filter(lang => lang.name !== this.selectedLanguage);
  }

  onLanguageSelect(language: { name: string; href: string; code: string }) {
    this.selectedLanguage = language.name;
  }
}

export default LanguagesPage;
