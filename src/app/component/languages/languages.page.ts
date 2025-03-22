import {ChangeDetectionStrategy, Component, inject, LOCALE_ID, ViewEncapsulation} from '@angular/core';

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

  public readonly languageList: { name: string; href: string; code: string }[] = [
    {name: 'Dansk', href: '/da', code: 'da'},
    {name: 'Polski', href: '/pl', code: 'pl'},
    {name: 'Ukrainian', href: '/uk', code: 'uk'},
    {name: 'English', href: '/en', code: 'en'}
  ];

  get filteredLanguages() {
    console.log(this.localeId)
    return this.languageList.filter(lang => lang.code !== this.currentLanguageCode);
  }
}

export default LanguagesPage;
