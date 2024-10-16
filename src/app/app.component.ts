import {Component, inject, OnInit} from '@angular/core';
import {environment} from "../environment/environment";
import {TranslateService} from "@ngx-translate/core";
import {SocialShareSeoService} from "../common/cdk/social-share.seo.service";
import {ChangeLanguageComponent} from "./component/change-language/change-language.component";
import {NgOptimizedImage} from "@angular/common";
import {NgIcon, provideIcons, provideNgIconsConfig} from "@ng-icons/core";
import {bootstrapThreeDots, bootstrapXLg} from "@ng-icons/bootstrap-icons";

enum MenuName {
  SERVICES = 'Послуги',
  TRAFFICS = 'Тарифи',
  REVIEWS = 'Відгуки',
  FAQ = 'FAQ',
  ABOUT_US = 'Про нас',
  CONSULTATION= 'Замовити консультацію',
  DEMO_ACCOUNT= 'Спробувати демо-аккаунт',
  LOGIN= 'Вхід'
}
interface MenuItem {
  name: MenuName;
  link: string;
  id: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    ChangeLanguageComponent,
    NgOptimizedImage,
    NgIcon,
  ],
  viewProviders: [
    provideIcons({bootstrapXLg, bootstrapThreeDots}),
    provideNgIconsConfig({
      size: '1.5em',
    }),
  ],
  host: {
    'class': 'flex flex-col'
  },
})
export class AppComponent implements OnInit {


  menuItems: MenuItem[] = [
    { id: 1, name: MenuName.SERVICES, link: '#' },
    { id: 2, name: MenuName.TRAFFICS, link: '#' },
    { id: 3, name: MenuName.REVIEWS, link: '#' },
    { id: 4, name: MenuName.FAQ, link: '#' },
    { id: 5, name: MenuName.ABOUT_US, link: '#' },
    { id: 6, name: MenuName.CONSULTATION, link: '#' },
    { id: 7, name: MenuName.DEMO_ACCOUNT, link: '#' },
    { id: 8, name: MenuName.LOGIN, link: '#' },
  ];

  private readonly translateService = inject(TranslateService);
  private readonly socialShareSeoService = inject(SocialShareSeoService);

  public readonly demoAccountUrl = new URL(environment.config.demoAccount.panelUrl);

  public readonly host = [environment.config.host, this.translateService.currentLang];
  public readonly consultationLink = environment.config.consultationLink;
  public isMobileMenuOpen = false;

  constructor() {
    this.demoAccountUrl.searchParams.set('login', environment.config.demoAccount.login);
    this.demoAccountUrl.searchParams.set('password', environment.config.demoAccount.password);
    console.log($localize`:@@appComponent.ngOnInit:App component initialized`);
  }

  public get hostString(): string {
    return environment.config.host;
  }

  public ngOnInit() {
    this.initializeSocialShareSeoService();
    this.translateService.onLangChange.subscribe((event) => {
      this.host[1] = event.lang;
      this.initializeSocialShareSeoService();
    });
  }

  public initializeSocialShareSeoService() {
    this.socialShareSeoService.setUrl(this.hostString);
    this.socialShareSeoService.setTwitterSiteCreator('@beeoclock.biz');
    this.socialShareSeoService.setAuthor('Bee O`clock');
    const {title, description, keywords, image, author} = this.translateService.instant('seo.page.main');
    this.socialShareSeoService.setTitle(title);
    this.socialShareSeoService.setDescription(description);
    this.socialShareSeoService.setKeywords(keywords);
    this.socialShareSeoService.setImage(image);
    this.socialShareSeoService.setAuthor(author);
    this.socialShareSeoService.setLocale(this.translateService.currentLang);
  }

  public toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
