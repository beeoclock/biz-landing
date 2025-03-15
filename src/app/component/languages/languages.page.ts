import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject, LOCALE_ID } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-languages',
  templateUrl: './languages.page.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguagesPage {
  private readonly localeId = inject(LOCALE_ID);
  private readonly router = inject(Router);
  public selectedLanguageCode: string;

  public readonly languageList: { name: string; href: string; code: string }[] = [
    { name: 'Dansk', href: '/da', code: 'da' },
    { name: 'Polski', href: '/pl', code: 'pl' },
    { name: 'Ukrainian', href: '/uk', code: 'uk' },
    { name: 'English', href: '/en', code: 'en' }
  ];

  constructor() {
    this.selectedLanguageCode = this.languageList.some(lang => lang.code === this.localeId) ? this.localeId : 'en';
  }

  get filteredLanguages() {
    return this.languageList.filter(lang => lang.code !== this.selectedLanguageCode);
  }

  onLanguageSelect(language: { name: string; href: string; code: string }) {
    this.selectedLanguageCode = language.code;
    this.router.navigate([language.href]);
  }
}

export default LanguagesPage;
