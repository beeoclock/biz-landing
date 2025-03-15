import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-languages',
  templateUrl: './languages.page.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguagesPage {

  public selectedLanguage: string = 'EN'

  public readonly languageList: {
    name: string;
    href: string;
    code: string;
  }[] = [
    {
      name: 'Dansk',
      href: '/da',
      code: 'da'
    },
    {
      name: 'Polski',
      href: '/pl',
      code: 'pl'
    },
    {
      name: 'Ukrainian',
      href: '/uk',
      code: 'uk'
    }
  ];

  onLanguageSelect(language: { name: string; href: string; code: string }) {
    this.selectedLanguage = language.name;
  }
}

export default LanguagesPage;

